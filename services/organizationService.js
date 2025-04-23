const organizationDAO = require('../data-access/organizationDAO');
const {getRespondentsByOrganization, getRespondentByID, setGroupNumberTo} = require("../data-access/respondentDAO");
const organizationHelperService = require('./organizationHelperService');
const {getRespondentsNotInGroups, findRespondentWithMaxAvailability,
    calculateGroupAvailability, calculateAvailabilityOverlap, updateGroupIds
} = require("./organizationHelperService");
const { Parser } = require('json2csv');


const getAllOrgs = async (organizerID) => {
    try{
        return await organizationDAO.getOrganizationsByOrganizer(organizerID);
    }catch(err){
       console.error('Error finding organizations', err);
       throw err;
    }
}

const getOrg = async(organizationID) => {
    try{
        return await organizationDAO.getOrganizationByID(organizationID);
    } catch(err){
        console.error('Error finding organization', err);
        throw err;
    }
}

const deleteOrg = async(organizationID) => {
    try{
        return await organizationDAO.removeByID(organizationID);
    } catch(err){
        console.error('Error deleting organization', err);
        throw err;
    }
}

const addOrg = async(orgData) => {
    try{
        return await organizationDAO.createOrg(orgData);
    } catch(err){
        console.error('Error adding organization', err);
        throw err;
    }
}

const groupingAlgorithm = async(organizationID) => {
    try {
        //Fetch Data
        const respondents = await getRespondentsByOrganization(organizationID);
        const organization = await organizationDAO.getOrganizationByID(organizationID);
        const groupSize = organization.group_size;

        //wipe existing group numbers for respondents
        for (const key in respondents) {
            if (respondents.hasOwnProperty(key)) {
                const respondent = respondents[key];
                await setGroupNumberTo(respondent.id, null);
            }
        }

        //Count respondents
        let respondentsLength = 0;
        for(const key in respondents) {
            if(respondents.hasOwnProperty(key)) {
                respondentsLength++;
            }
        }
        //determine how many groups to form (no partial groups)
        const numberOfGroups = Math.floor(respondentsLength / groupSize);
        const groups = [];

        //count number of group leaders, make sure it's less than # of groups
        let numberOfLeaders = 0;
        for (const key in respondents) {
            if (respondents.hasOwnProperty(key)) {
                const respondent = respondents[key];
                if (respondent.isLeader) {
                    numberOfLeaders++;
                }
            }
        }
        if (numberOfLeaders > numberOfGroups) {
            throw new Error(`Too many group leaders: ${numberOfLeaders} for ${numberOfGroups} groups`);
        }

        //initalize empty groups with group leaders
        respondents.forEach((respondent) => {
            if (respondent.is_group_leader) {
                groups.push([respondent]);
            }
        })

        //If there aren't enough group leaders for all of the groups, pick the respondents with the most availability to start the remaining groups.
        if (numberOfLeaders < numberOfGroups) {
            let leftover = numberOfGroups - numberOfLeaders;
            while (leftover > 0) {
                let maxAvailableRespondent = null;
                const availableRespondents = getRespondentsNotInGroups(respondents, groups)
                maxAvailableRespondent = findRespondentWithMaxAvailability(availableRespondents);
                groups.push([maxAvailableRespondent])
                leftover--;
            }
        }

        //get all remaining available repsondents
        let availableRespondents = getRespondentsNotInGroups(respondents, groups);
        let maxAvailableRespondent = null;

        //assign remaining respondents to groups
        while (availableRespondents.length > 0) {
            //find the respondent with the most total availability
            maxAvailableRespondent = findRespondentWithMaxAvailability(availableRespondents);

            let maxOverlap = 0;
            let bestGroupIndex = null;

            //Find the group with the most availability overlap for this respondent
            groups.forEach((group, index) => {
                const groupAvailability = calculateGroupAvailability(group);
                const overlap = calculateAvailabilityOverlap(groupAvailability, maxAvailableRespondent.availability);

                if (overlap > maxOverlap) {
                    maxOverlap = overlap;
                    bestGroupIndex = index;
                }
            });

            //add respondent to the group with best availability match
            if (bestGroupIndex !== null) {
                groups[bestGroupIndex].push(maxAvailableRespondent);
            } else {
                //if no overlap is found at all (unlikely), just add to the smallest group
                let smallestGroupIndex = groups.reduce((minIndex, group, index, arr) =>
                    group.length < arr[minIndex].length ? index : minIndex, 0
                );
                groups[smallestGroupIndex].push(maxAvailableRespondent);
            }

            //Update the list of ungrouped respondents
            availableRespondents = getRespondentsNotInGroups(respondents, groups);
        }

        //save the group IDs to the database
        updateGroupIds(groups);

        return await organizationDAO.getOrganizationByID(organizationID);

    } catch(err){
        console.error('Error in Grouping Algorithm', err);
    }
}

const getGroupsAvailability = async (organizationID) => {
    try {
        const respondents = await getRespondentsByOrganization(organizationID);

        const groupMap = {};

        //group respondents by group_number (skip if group_number is null)
        respondents.forEach(respondent => {
            const group = respondent.group_number;
            const availability = respondent.availability || [];

            if (group === null || group === undefined) return;

            if (!groupMap[group]) {
                groupMap[group] = [];
            }

            groupMap[group].push(availability);
        });

        const groupAvailability = {};
        const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        for (const [group, availabilitiesList] of Object.entries(groupMap)) {
            const groupAvailabilities = [];

            for (const day of DAYS_OF_WEEK) {
                //gather daily availability for each respondent in the group
                const dailySlots = availabilitiesList.map(personSlots =>
                    personSlots.filter(slot => slot.day === day)
                );

                //skip day if any respondent has no availability for it
                if (dailySlots.some(slots => slots.length === 0)) continue;

                //start with the first person’s slots
                let intersection = dailySlots[0];

                for (let i = 1; i < dailySlots.length; i++) {
                    const nextPerson = dailySlots[i];
                    const newIntersection = [];

                    for (const slot1 of intersection) {
                        for (const slot2 of nextPerson) {
                            const start = Math.max(organizationHelperService.parseTime(slot1.start), organizationHelperService.parseTime(slot2.start));
                            const end = Math.min(organizationHelperService.parseTime(slot1.end), organizationHelperService.parseTime(slot2.end));

                            if (start < end) {
                                newIntersection.push({
                                    day,
                                    start: organizationHelperService.formatTime(start),
                                    end: organizationHelperService.formatTime(end)
                                });
                            }
                        }
                    }

                    intersection = newIntersection;
                    if (intersection.length === 0) break; //means no overlap left
                }

                groupAvailabilities.push(...intersection);
            }

            groupAvailability[group] = groupAvailabilities;
        }

        return groupAvailability;
    } catch (err) {
        console.error('Error getting group availabilities:', err);
        throw err;
    }
};

const exportGroupsToCSV = async (organizationID) => {
    const respondents = await getRespondentsByOrganization(organizationID);

    const exportData = respondents.map(respondent => ({
        Name: respondent.name,
        Email: respondent.email,
        Group: respondent.group_number ?? "Unassigned",
    }));

    const fields = ['Name', 'Email', 'Group'];
    const parser = new Parser({ fields });
    const csv = parser.parse(exportData);

    return csv;
}

module.exports = {
    getAllOrgs,
    getOrg,
    deleteOrg,
    addOrg,
    groupingAlgorithm,
    getGroupsAvailability,
    exportGroupsToCSV,
}