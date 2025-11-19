import {
    progressBar,
    progressText,
    hoursWorkedEl,
    totalHoursEl,
    percentageEl,
    statusMessage
} from './domElements.js';
import { calculateProgress } from './progressCalculator.js';

// Update the UI with current progress
export function updateProgress() {
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
