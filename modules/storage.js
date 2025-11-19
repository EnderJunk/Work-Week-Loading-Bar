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
