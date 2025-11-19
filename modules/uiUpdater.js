import {
    progressBar,
    progressText,
    hoursWorkedEl,
    totalHoursEl,
    percentageEl,
    statusMessage,
    statusText,
    shiftProgressSection,
    shiftLabel,
    shiftProgressBar,
    shiftProgressText,
    shiftTimeInfo,
    toggleShiftButton
} from './domElements.js';
import { calculateProgress, calculateShiftProgress } from './progressCalculator.js';
import { getWorkingDays, getCurrentDateTime } from './schedule.js';
import { saveShiftViewPreference, loadShiftViewPreference } from './storage.js';

// Track view mode for shift progress
let showTimeRemaining = loadShiftViewPreference();

// Update the UI with current progress
export function updateProgress() {
    const progress = calculateProgress();
    const workingDays = getWorkingDays();
    const { currentDay } = getCurrentDateTime();
    const isWorkingDay = workingDays.includes(currentDay);
    
    // Update stats
    hoursWorkedEl.textContent = progress.hoursWorked;
    totalHoursEl.textContent = progress.totalHours;
    percentageEl.textContent = `${progress.percentage}%`;
    
    // Update progress bar
    progressBar.style.width = `${progress.percentage}%`;
    progressText.textContent = `${progress.percentage}%`;
    
    // Update status message container styling
    statusMessage.className = 'status-message';
    
    if (progress.isWeekend) {
        statusMessage.classList.add('weekend');
    } else if (progress.percentage >= 100) {
        statusMessage.classList.add('complete');
    } else {
        statusMessage.classList.add('working');
    }
    
    // Show/hide shift progress section based on working day and if currently in shift
    const shiftProgress = calculateShiftProgress();
    const showShiftProgress = isWorkingDay && !progress.isWeekend && 
                              !shiftProgress.isBeforeShift && !shiftProgress.isAfterShift;
    
    if (showShiftProgress) {
        statusText.style.display = 'none';
        shiftProgressSection.style.display = 'block';
        updateShiftProgress();
    } else {
        statusText.style.display = 'block';
        statusText.textContent = progress.status;
        shiftProgressSection.style.display = 'none';
    }
}

// Update shift progress display
function updateShiftProgress() {
    const shiftProgress = calculateShiftProgress();
    
    if (showTimeRemaining) {
        // Show time remaining view
        const hours = Math.floor(shiftProgress.minutesRemaining / 60);
        const minutes = shiftProgress.minutesRemaining % 60;
        
        shiftTimeInfo.textContent = `💼 Currently working! ${hours}h ${minutes}m until end of shift`;
        
        toggleShiftButton.textContent = '📊 Progress Bar';
        shiftLabel.style.display = 'none';
        shiftProgressBar.parentElement.style.display = 'none';
        shiftTimeInfo.style.display = 'block';
    } else {
        // Show progress bar view
        shiftProgressBar.style.width = `${shiftProgress.percentage}%`;
        shiftProgressText.textContent = `${shiftProgress.percentage.toFixed(0)}%`;
        
        toggleShiftButton.textContent = '⏱️ Time Left';
        shiftLabel.style.display = 'block';
        shiftProgressBar.parentElement.style.display = 'block';
        shiftTimeInfo.style.display = 'none';
    }
}

// Toggle between time remaining and progress bar
export function toggleShiftView() {
    showTimeRemaining = !showTimeRemaining;
    saveShiftViewPreference(showTimeRemaining);
    updateShiftProgress();
}
