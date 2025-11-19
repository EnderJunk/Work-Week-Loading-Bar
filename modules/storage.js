import { checkboxes, startTimeInput, endTimeInput } from './domElements.js';
import { getWorkingDays } from './schedule.js';

// Save schedule to local storage
export function saveScheduleToLocalStorage() {
    const workingDays = getWorkingDays();
    const schedule = {
        workingDays: workingDays,
        startTime: startTimeInput.value,
        endTime: endTimeInput.value
    };
    localStorage.setItem('workSchedule', JSON.stringify(schedule));
}

// Load schedule from local storage
export function loadScheduleFromLocalStorage() {
    const savedSchedule = localStorage.getItem('workSchedule');
    if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        
        // Uncheck all checkboxes first
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Check saved working days
        schedule.workingDays.forEach(day => {
            const checkbox = document.querySelector(`input[type="checkbox"][value="${day}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Set times
        startTimeInput.value = schedule.startTime;
        endTimeInput.value = schedule.endTime;
        
        return true;
    }
    return false;
}

// Save shift view preference to local storage
export function saveShiftViewPreference(showTimeRemaining) {
    localStorage.setItem('shiftViewPreference', JSON.stringify(showTimeRemaining));
}

// Load shift view preference from local storage
export function loadShiftViewPreference() {
    const savedPreference = localStorage.getItem('shiftViewPreference');
    if (savedPreference !== null) {
        return JSON.parse(savedPreference);
    }
    return false; // Default to progress bar view
}

// Save stats visibility preference to local storage
export function saveStatsVisibility(isVisible) {
    localStorage.setItem('statsVisible', JSON.stringify(isVisible));
}

// Load stats visibility preference from local storage
export function loadStatsVisibility() {
    const savedVisibility = localStorage.getItem('statsVisible');
    if (savedVisibility !== null) {
        return JSON.parse(savedVisibility);
    }
    return false; // Default to hidden
}
