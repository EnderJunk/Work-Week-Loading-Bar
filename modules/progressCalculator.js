import { getWorkingDays, getHoursPerDay, getCurrentDateTime, getShiftTimes } from './schedule.js';

// Calculate today's shift progress
export function calculateShiftProgress() {
    const { currentTimeInMinutes } = getCurrentDateTime();
    const { shiftStartMinutes, shiftEndMinutes } = getShiftTimes();
    const shiftTotalMinutes = shiftEndMinutes - shiftStartMinutes;
    
    const baseResult = {
        totalMinutes: shiftTotalMinutes,
        isBeforeShift: false,
        isAfterShift: false
    };
    
    if (currentTimeInMinutes < shiftStartMinutes) {
        return {
            ...baseResult,
            percentage: 0,
            minutesWorked: 0,
            minutesRemaining: shiftTotalMinutes,
            isBeforeShift: true
        };
    }
    
    if (currentTimeInMinutes >= shiftEndMinutes) {
        return {
            ...baseResult,
            percentage: 100,
            minutesWorked: shiftTotalMinutes,
            minutesRemaining: 0,
            isAfterShift: true
        };
    }
    
    const minutesWorked = currentTimeInMinutes - shiftStartMinutes;
    const minutesRemaining = shiftEndMinutes - currentTimeInMinutes;
    
    return {
        ...baseResult,
        percentage: (minutesWorked / shiftTotalMinutes) * 100,
        minutesWorked,
        minutesRemaining
    };
}

// Get status message based on current work state
function getStatusMessage(isWorkingDay, currentTimeInMinutes, shiftStartMinutes, shiftEndMinutes) {
    if (!isWorkingDay) {
        return "🎉 It's the weekend! Enjoy your time off!";
    }
    
    if (currentTimeInMinutes < shiftStartMinutes) {
        return "⏰ Your shift hasn't started yet today";
    }
    
    if (currentTimeInMinutes >= shiftEndMinutes) {
        return "✅ Shift complete for today! Great work!";
    }
    
    const remainingMinutes = shiftEndMinutes - currentTimeInMinutes;
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;
    return `💼 Currently working! ${remainingHours}h ${remainingMins}m until end of shift`;
}

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
            status: 'No working days selected',
            isWeekend: true
        };
    }
    
    const isWorkingDay = workingDays.includes(currentDay);
    const { shiftStartMinutes, shiftEndMinutes } = getShiftTimes();
    const totalHours = workingDays.length * hoursPerDay;
    
    // Calculate hours worked
    let hoursWorked = workingDays
        .filter(day => day < currentDay)
        .reduce((acc) => acc + hoursPerDay, 0);
    
    // Add partial hours for today if working
    if (isWorkingDay) {
        if (currentTimeInMinutes >= shiftEndMinutes) {
            hoursWorked += hoursPerDay;
        } else if (currentTimeInMinutes > shiftStartMinutes) {
            hoursWorked += (currentTimeInMinutes - shiftStartMinutes) / 60;
        }
    }
    
    const percentage = totalHours > 0 ? (hoursWorked / totalHours) * 100 : 0;
    const status = getStatusMessage(isWorkingDay, currentTimeInMinutes, shiftStartMinutes, shiftEndMinutes);
    
    return {
        hoursWorked: hoursWorked.toFixed(1),
        totalHours: totalHours.toFixed(1),
        percentage: Math.min(percentage, 100).toFixed(1),
        status,
        isWeekend: !isWorkingDay
    };
}
