//helper functions to handle time parsing
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

export {
    parseTime,
    formatTime,
}
