//helper functions
import respondentService from '../services/respondentService.js';
import moment from 'moment';

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

//helper functions to handle time formatting
function formatTime(minutes) {
    const hrs = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}`;
}



function calculateAvailability(availability) {
    if (!availability || availability.length === 0) {
        return 0; // Return 0 if no availability is provided
    }
    let totalHours = 0;

    availability.forEach(function (slot) {
        const startTime = moment(slot.start, 'HH:mm'); //parse start time
        const endTime = moment(slot.end, 'HH:mm');     //parse end time
        const duration = moment.duration(endTime.diff(startTime)); //calculate duration
        totalHours += duration.asHours(); //convert duration to hours and add to total
    });

    return totalHours;
}

function getRespondentsNotInGroups(respondents, groups) {
    const respondentsNotInGroups = [];

    respondents.forEach(function (respondent) {
        let isInGroup = false;

        groups.forEach(function (group) {
            if (group.includes(respondent)) {
                isInGroup = true;
            }
        });

        if (!isInGroup) {
            respondentsNotInGroups.push(respondent);
        }
    });

    return respondentsNotInGroups;
}

function calculateAvailabilityOverlap(availability1, availability2) {
    let totalOverlap = 0;

    // Iterate through the availability slots of the first respondent
    availability1.forEach(function (slot1) {
        // Find matching days in the second respondent's availability
        availability2.forEach(function (slot2) {
            if (slot1.day === slot2.day) { // Compare days
                const startTime1 = moment(slot1.start, 'HH:mm');
                const endTime1 = moment(slot1.end, 'HH:mm');
                const startTime2 = moment(slot2.start, 'HH:mm');
                const endTime2 = moment(slot2.end, 'HH:mm');

                // Calculate overlap
                const overlapStart = moment.max(startTime1, startTime2); // Latest start time
                const overlapEnd = moment.min(endTime1, endTime2);       // Earliest end time

                if (overlapStart.isBefore(overlapEnd)) { // Check if there's an overlap
                    const duration = moment.duration(overlapEnd.diff(overlapStart));
                    totalOverlap += duration.asHours(); // Add overlap duration in hours
                }
            }
        });
    });

    return totalOverlap; // Total overlapping hours
}

function calculateGroupAvailability(group) {
    const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const overlappingAvailability = [];

    // Initialize availability structure for each day
    const dayWiseOverlaps = {};

    DAYS_OF_WEEK.forEach(function (day) {
        dayWiseOverlaps[day] = []; // Start with an empty array for each day
    });

    // Iterate through each respondent in the group
    group.forEach(function (respondent) {
        const dayWiseAvailability = {};

        // Organize availability by day for this respondent
        respondent.availability.forEach(function (slot) {
            const day = slot.day;

            if (!dayWiseAvailability[day]) {
                dayWiseAvailability[day] = [];
            }

            dayWiseAvailability[day].push({
                start: moment(slot.start, "HH:mm"),
                end: moment(slot.end, "HH:mm")
            });
        });

        // Merge respondent's availability into group availability
        DAYS_OF_WEEK.forEach(function (day) {
            if (dayWiseAvailability[day]) {
                if (dayWiseOverlaps[day].length === 0) {
                    // If no group availability for this day yet, copy respondent's slots
                    dayWiseOverlaps[day] = [...dayWiseAvailability[day]];
                } else {
                    // Otherwise, calculate the overlap for each existing time slot
                    dayWiseOverlaps[day] = dayWiseOverlaps[day].flatMap(function (existingSlot) {
                        return dayWiseAvailability[day].map(function (newSlot) {
                            const overlapStart = moment.max(existingSlot.start, newSlot.start);
                            const overlapEnd = moment.min(existingSlot.end, newSlot.end);

                            // If there's a valid overlap, include it
                            if (overlapStart.isBefore(overlapEnd)) {
                                return {
                                    start: overlapStart,
                                    end: overlapEnd
                                };
                            }
                            return null; // Ignore if no overlap
                        }).filter(Boolean); // Remove null results
                    });
                }
            }
        });
    });

    // Convert to the desired format
    DAYS_OF_WEEK.forEach(function (day) {
        if (dayWiseOverlaps[day].length > 0) {
            dayWiseOverlaps[day].forEach(function (slot) {
                overlappingAvailability.push({
                    day: day,
                    start: slot.start,
                    end: slot.end
                });
            });
        }
    });

    return overlappingAvailability;
}

function findRespondentWithMaxAvailability(respondents) {
    let maxAvailableTime = 0;
    let maxAvailableRespondent = null;

    respondents.forEach((respondent) => {
        const totalAvailability = calculateAvailability(respondent.availability);

        if (totalAvailability > maxAvailableTime) {
            maxAvailableTime = totalAvailability;
            maxAvailableRespondent = respondent;
        }

    });

    return maxAvailableRespondent; // Return the respondent with the most available time
}

function updateGroupIds(groups) {
    groups.forEach(function (group, groupId) {
        group.forEach(function (respondent) {
            respondent.groupId = groupId + 1; // Assign a groupId (starting from 1)
            respondentService.setGroupNumber(respondent.id, respondent.groupId).then();
        });
    });
}




export {
    parseTime,
    formatTime,
    calculateAvailability,
    getRespondentsNotInGroups,
    calculateAvailabilityOverlap,
    calculateGroupAvailability,
    findRespondentWithMaxAvailability,
    updateGroupIds,
}
