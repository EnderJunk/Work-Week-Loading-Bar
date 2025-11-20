import { checkboxes, startTimeInput, endTimeInput } from './domElements.js';

// Get selected working days
export function getWorkingDays() {
    return Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.value));
}

// Parse time string to minutes
export function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// Get shift time boundaries in minutes
export function getShiftTimes() {
    const shiftStartMinutes = timeToMinutes(startTimeInput.value);
    const shiftEndMinutes = timeToMinutes(endTimeInput.value);
    return { shiftStartMinutes, shiftEndMinutes };
}

// Calculate hours per day based on shift times
export function getHoursPerDay() {
    if (!startTimeInput.value || !endTimeInput.value) {
        return 8; // Default 8 hours
    }
    
    const { shiftStartMinutes, shiftEndMinutes } = getShiftTimes();
    return (shiftEndMinutes - shiftStartMinutes) / 60;
}

// Get current date and time information
export function getCurrentDateTime() {
    const now = new Date();
    return {
        currentDay: now.getDay(),
        currentHour: now.getHours(),
        currentMinute: now.getMinutes(),
        currentTimeInMinutes: now.getHours() * 60 + now.getMinutes()
    };
}
