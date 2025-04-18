const organizationDAO = require('../data-access/organizationDAO');
const {getRespondentsByOrganization} = require("../data-access/respondentDAO");
const organizationHelperService = require('./organizationHelperService');
const {getRespondentsNotInGroups, findRespondentWithMaxAvailability,
    calculateGroupAvailability, calculateAvailabilityOverlap, updateGroupIds
} = require("./organizationHelperService");

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
        const respondents = await getRespondentsByOrganization(organizationID);
        const organization = await organizationDAO.getOrganizationByID(organizationID);
        const groupSize = organization.group_size;

        let respondentsLength = 0;
        for(const key in respondents) {
            if(respondents.hasOwnProperty(key)) {
                respondentsLength++;
            }
        }
        const numberOfGroups = Math.floor(respondentsLength / groupSize);
        const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const groups = [];

        let countGroupLeaders = 0;

        respondents.forEach((respondent) => {
            if (respondent.is_group_leader) {
                countGroupLeaders += 1;
                groups.push([respondent]);
            }
        })

        if (countGroupLeaders < numberOfGroups) {
            let leftover = numberOfGroups - countGroupLeaders;
            while (leftover > 0) {
                let maxAvailableRespondent = null;
                const availableRespondents = getRespondentsNotInGroups(respondents, groups)
                maxAvailableRespondent = findRespondentWithMaxAvailability(availableRespondents);
                groups.push([maxAvailableRespondent])
                leftover--;
            }
        }

        let availableRespondents = getRespondentsNotInGroups(respondents, groups);
        let maxAvailableRespondent = null;

        while (availableRespondents.length > 0) {
            maxAvailableRespondent = findRespondentWithMaxAvailability(availableRespondents);
            let maxOverlap = 0;
            let maxGroup = null;
            groups.forEach(function (group) {
                if (group.length > groupSize + 1) {
                }
                let groupAvailability = calculateGroupAvailability(group);
                const overlap = calculateAvailabilityOverlap(groupAvailability, maxAvailableRespondent.availability);
                if (overlap > maxOverlap) {
                    maxOverlap = overlap;
                    maxGroup = group;
                }
            });

            if (maxGroup) {
                maxGroup.push(maxAvailableRespondent);
            }
            // end
            availableRespondents = getRespondentsNotInGroups(respondents, groups);
        }

        updateGroupIds(groups)
        return await organizationDAO.getOrganizationByID(organizationID);
    } catch(err){
        console.error('Error updating groups', err);
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