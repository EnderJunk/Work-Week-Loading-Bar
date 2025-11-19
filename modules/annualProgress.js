// Calculate annual work progress based on working days
export function calculateAnnualProgress(workingDays, hoursPerDay) {
    const now = new Date();
    const year = now.getFullYear();
    
    // Start of the year
    const startOfYear = new Date(year, 0, 1);
    
    // End of the year
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    
    // Count working days in the year
    let totalWorkDays = 0;
    let workDaysPassed = 0;
    
    // Iterate through each day of the year
    let currentDate = new Date(startOfYear);
    while (currentDate <= endOfYear) {
        const dayOfWeek = currentDate.getDay();
        
        // Check if this is a working day
        if (workingDays.includes(dayOfWeek)) {
            totalWorkDays++;
            
            // Check if this working day has passed
            if (currentDate < now) {
                workDaysPassed++;
            }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // If we're in the middle of a work day, add partial progress
    const todayDayOfWeek = now.getDay();
    if (workingDays.includes(todayDayOfWeek)) {
        const startHour = parseInt(hoursPerDay.startTime.split(':')[0]);
        const startMinute = parseInt(hoursPerDay.startTime.split(':')[1]);
        const endHour = parseInt(hoursPerDay.endTime.split(':')[0]);
        const endMinute = parseInt(hoursPerDay.endTime.split(':')[1]);
        
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        const shiftStartMinutes = startHour * 60 + startMinute;
        const shiftEndMinutes = endHour * 60 + endMinute;
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        if (currentTimeInMinutes > shiftStartMinutes && currentTimeInMinutes < shiftEndMinutes) {
            const shiftTotalMinutes = shiftEndMinutes - shiftStartMinutes;
            const minutesWorked = currentTimeInMinutes - shiftStartMinutes;
            const partialDayProgress = minutesWorked / shiftTotalMinutes;
            
            // Subtract the full day we already counted and add partial
            workDaysPassed = workDaysPassed - 1 + partialDayProgress;
        }
    }
    
    const workDaysRemaining = totalWorkDays - workDaysPassed;
    const totalWorkHours = totalWorkDays * hoursPerDay.hours;
    const hoursWorked = workDaysPassed * hoursPerDay.hours;
    const hoursRemaining = totalWorkHours - hoursWorked;
    
    // Calculate percentage
    const percentage = totalWorkDays > 0 ? (workDaysPassed / totalWorkDays) * 100 : 0;
    
    return {
        workDaysPassed: Math.floor(workDaysPassed),
        workDaysRemaining: Math.ceil(workDaysRemaining),
        hoursWorked: hoursWorked.toFixed(1),
        hoursRemaining: hoursRemaining.toFixed(1),
        totalWorkDays: totalWorkDays,
        totalWorkHours: totalWorkHours.toFixed(1),
        percentage: percentage.toFixed(2),
        year: year
    };
}
