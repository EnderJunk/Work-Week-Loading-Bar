import { startTimeInput, endTimeInput } from './domElements.js';
import { getWorkingDays, getHoursPerDay, getCurrentDateTime } from './schedule.js';

// Calculate work week progress
export function calculateProgress() {
    const workingDays = getWorkingDays();
    const hoursPerDay = getHoursPerDay();
    const { currentDay, currentTimeInMinutes } = getCurrentDateTime();
    
    if (workingDays.length === 0) {
        return {
            hoursWorked: 0,
            totalHours: 0,
            percentage: 0,
            status: 'No working days selected'
        };
    }
    
    // Check if today is a working day
    const isWorkingDay = workingDays.includes(currentDay);
    
    // Get shift times in minutes
    const [startHour, startMinute] = startTimeInput.value.split(':').map(Number);
    const [endHour, endMinute] = endTimeInput.value.split(':').map(Number);
    const shiftStartMinutes = startHour * 60 + startMinute;
    const shiftEndMinutes = endHour * 60 + endMinute;
    
    // Calculate total hours in the work week
    const totalHours = workingDays.length * hoursPerDay;
    
    // Calculate hours worked so far
    let hoursWorked = 0;
    
    // Count completed working days
    for (let day of workingDays) {
        if (day < currentDay) {
            hoursWorked += hoursPerDay;
        }
    }
    
    // If today is a working day, add partial hours
    if (isWorkingDay) {
        if (currentTimeInMinutes >= shiftEndMinutes) {
            // Shift is complete today
            hoursWorked += hoursPerDay;
        } else if (currentTimeInMinutes > shiftStartMinutes) {
            // Currently in shift
            const minutesWorked = currentTimeInMinutes - shiftStartMinutes;
            hoursWorked += minutesWorked / 60;
        }
        // If before shift start, add 0 hours for today
    }
    
    // Calculate percentage
    const percentage = totalHours > 0 ? (hoursWorked / totalHours) * 100 : 0;
    
    // Determine status message
    let status = '';
    if (!isWorkingDay) {
        status = "🎉 It's the weekend! Enjoy your time off!";
    } else if (currentTimeInMinutes < shiftStartMinutes) {
        status = "⏰ Your shift hasn't started yet today";
    } else if (currentTimeInMinutes >= shiftEndMinutes) {
        status = "✅ Shift complete for today! Great work!";
    } else {
        const remainingMinutes = shiftEndMinutes - currentTimeInMinutes;
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remainingMins = remainingMinutes % 60;
        status = `💼 Currently working! ${remainingHours}h ${remainingMins}m until end of shift`;
    }
    
    return {
        hoursWorked: hoursWorked.toFixed(1),
        totalHours: totalHours.toFixed(1),
        percentage: Math.min(percentage, 100).toFixed(1),
        status: status,
        isWeekend: !isWorkingDay
    };
}
