import { submitButton, editScheduleButton, editScheduleButtonBottom, toggleShiftButton, toggleStatsButton, progressStats, secretButton, annualSection, annualProgressBar, annualProgressText, annualHoursRemainingText, startTimeInput, endTimeInput } from './modules/domElements.js';
import { updateProgress, toggleShiftView } from './modules/uiUpdater.js';
import { saveScheduleToLocalStorage, loadScheduleFromLocalStorage, saveStatsVisibility, loadStatsVisibility } from './modules/storage.js';
import { collapseSettings, expandSettings } from './modules/uiControls.js';
import { calculateAnnualProgress } from './modules/annualProgress.js';
import { getWorkingDays, getHoursPerDay } from './modules/schedule.js';

// Initialize the application
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Load saved schedule if exists
    const hasSchedule = loadScheduleFromLocalStorage();
    if (hasSchedule) {
        collapseSettings();
    }
    
    // Load stats visibility preference
    const statsVisible = loadStatsVisibility();
    if (statsVisible) {
        toggleStats();
    }
    
    // Initial progress update
    updateProgress();
    
    // Auto-update every minute
    setInterval(updateProgress, 60000);
}

// Generic toggle visibility function
function toggleElement(element, button, showText, hideText, saveCallback = null) {
    const isVisible = element.style.display !== 'none';
    element.style.display = isVisible ? 'none' : (element.classList.contains('progress-stats') ? 'grid' : 'block');
    if (button) button.textContent = isVisible ? showText : hideText;
    if (saveCallback) saveCallback(!isVisible);
}

// Toggle stats visibility
function toggleStats() {
    toggleElement(progressStats, toggleStatsButton, 'Show Stats', 'Hide Stats', saveStatsVisibility);
}

// Toggle annual section
function toggleAnnualSection() {
    const isVisible = annualSection.style.display !== 'none';
    if (!isVisible) updateAnnualProgress();
    toggleElement(annualSection, null, null, null);
}

// Update annual progress
function updateAnnualProgress() {
    const workingDays = getWorkingDays();
    const hoursPerDay = getHoursPerDay();
    
    const hoursData = {
        hours: hoursPerDay,
        startTime: startTimeInput.value,
        endTime: endTimeInput.value
    };
    
    const progress = calculateAnnualProgress(workingDays, hoursData);
    
    annualProgressBar.style.width = `${progress.percentage}%`;
    annualProgressText.textContent = `${progress.percentage}%`;
    annualHoursRemainingText.textContent = `${progress.hoursRemaining} hours remaining`;
}

// Set up all event listeners
function setupEventListeners() {
    const eventMap = [
        [submitButton, () => {
            saveScheduleToLocalStorage();
            collapseSettings();
            updateProgress();
        }],
        [editScheduleButton, expandSettings],
        [editScheduleButtonBottom, expandSettings],
        [toggleShiftButton, toggleShiftView],
        [toggleStatsButton, toggleStats],
        [secretButton, toggleAnnualSection]
    ];
    
    eventMap.forEach(([button, handler]) => {
        button.addEventListener('click', handler);
    });
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
