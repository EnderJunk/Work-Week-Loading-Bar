// Get DOM elements
const checkboxes = document.querySelectorAll('.day-checkboxes input[type="checkbox"]');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const submitButton = document.getElementById('submit-btn');
const editScheduleButton = document.getElementById('edit-schedule-btn');
const editScheduleButtonBottom = document.getElementById('edit-schedule-btn-bottom');
const settingsPanel = document.getElementById('settings-panel');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const hoursWorkedEl = document.getElementById('hours-worked');
const totalHoursEl = document.getElementById('total-hours');
const percentageEl = document.getElementById('percentage');
const statusMessage = document.getElementById('status-message');

// Function to get selected working days
function getWorkingDays() {
    const workingDays = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            workingDays.push(parseInt(checkbox.value));
        }
    });
    return workingDays;
}

// Function to calculate hours per day
function getHoursPerDay() {
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

// Function to get current date and time info
function getCurrentDateTime() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    return { currentDay, currentHour, currentMinute, currentTimeInMinutes };
}

// Function to calculate progress
function calculateProgress() {
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
    
    // Check if today is a weekend (not a working day)
    const isWorkingDay = workingDays.includes(currentDay);
    
    // Get shift times in minutes
    const [startHour, startMinute] = startTimeInput.value.split(':').map(Number);
    const [endHour, endMinute] = endTimeInput.value.split(':').map(Number);
    const shiftStartMinutes = startHour * 60 + startMinute;
    const shiftEndMinutes = endHour * 60 + endMinute;
    
    // Find the start of the work week (first working day)
    let workWeekStart = Math.min(...workingDays);
    
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

// Function to update the UI
function updateProgress() {
    const progress = calculateProgress();
    
    // Update stats
    hoursWorkedEl.textContent = progress.hoursWorked;
    totalHoursEl.textContent = progress.totalHours;
    percentageEl.textContent = `${progress.percentage}%`;
    
    // Update progress bar
    progressBar.style.width = `${progress.percentage}%`;
    progressText.textContent = `${progress.percentage}%`;
    
    // Update status message
    statusMessage.textContent = progress.status;
    statusMessage.className = 'status-message';
    
    if (progress.isWeekend) {
        statusMessage.classList.add('weekend');
    } else if (progress.percentage >= 100) {
        statusMessage.classList.add('complete');
    } else {
        statusMessage.classList.add('working');
    }
}

// Local Storage Functions
function saveScheduleToLocalStorage() {
    const workingDays = getWorkingDays();
    const schedule = {
        workingDays: workingDays,
        startTime: startTimeInput.value,
        endTime: endTimeInput.value
    };
    localStorage.setItem('workSchedule', JSON.stringify(schedule));
}

function loadScheduleFromLocalStorage() {
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

function collapseSettings() {
    settingsPanel.style.display = 'none';
    editScheduleButton.style.display = 'none';
    editScheduleButtonBottom.style.display = 'block';
}

function expandSettings() {
    settingsPanel.style.display = 'block';
    editScheduleButton.style.display = 'none';
    editScheduleButtonBottom.style.display = 'none';
}

// Event listeners
submitButton.addEventListener('click', () => {
    saveScheduleToLocalStorage();
    collapseSettings();
    updateProgress();
});

editScheduleButton.addEventListener('click', () => {
    expandSettings();
});

editScheduleButtonBottom.addEventListener('click', () => {
    expandSettings();
});

// Initial setup on page load
const hasSchedule = loadScheduleFromLocalStorage();
if (hasSchedule) {
    collapseSettings();
}
updateProgress();

// Auto-update every minute
setInterval(updateProgress, 60000);
