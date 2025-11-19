import { checkboxes, startTimeInput, endTimeInput } from './domElements.js';

// Get selected working days
export function getWorkingDays() {
    const workingDays = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            workingDays.push(parseInt(checkbox.value));
        }
    });
    return workingDays;
}

// Calculate hours per day based on shift times
export function getHoursPerDay() {
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    
    if (!startTime || !endTime) {
        return 8; // Default 8 hours
    }
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    const totalMinutes = endMinutes - startMinutes;
    return totalMinutes / 60;
}

// Get current date and time information
export function getCurrentDateTime() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    return { currentDay, currentHour, currentMinute, currentTimeInMinutes };
}
