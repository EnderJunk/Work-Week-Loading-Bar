import { submitButton, editScheduleButton, editScheduleButtonBottom, toggleShiftButton, toggleStatsButton, progressStats, secretButton, annualSection, annualProgressBar, annualProgressText, annualStats, toggleAnnualStatsButton, daysPassed, daysRemaining, totalWorkDays, annualHoursWorked, annualHoursRemaining, annualPercentage, startTimeInput, endTimeInput } from './modules/domElements.js';
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

// Toggle stats visibility
function toggleStats() {
    const isVisible = progressStats.style.display !== 'none';
    
    if (isVisible) {
        progressStats.style.display = 'none';
        toggleStatsButton.textContent = 'Show Stats';
    } else {
        progressStats.style.display = 'grid';
        toggleStatsButton.textContent = 'Hide Stats';
    }
    
    saveStatsVisibility(!isVisible);
}

// Toggle annual section
function toggleAnnualSection() {
    const isVisible = annualSection.style.display !== 'none';
    
    if (isVisible) {
        annualSection.style.display = 'none';
    } else {
        annualSection.style.display = 'block';
        updateAnnualProgress();
    }
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
    daysPassed.textContent = progress.workDaysPassed;
    daysRemaining.textContent = progress.workDaysRemaining;
    totalWorkDays.textContent = progress.totalWorkDays;
    annualHoursWorked.textContent = progress.hoursWorked;
    annualHoursRemaining.textContent = progress.hoursRemaining;
    annualPercentage.textContent = `${progress.percentage}%`;
}

// Toggle annual stats visibility
function toggleAnnualStats() {
    const isVisible = annualStats.style.display !== 'none';
    
    if (isVisible) {
        annualStats.style.display = 'none';
        toggleAnnualStatsButton.textContent = 'Show Stats';
    } else {
        annualStats.style.display = 'grid';
        toggleAnnualStatsButton.textContent = 'Hide Stats';
    }
}

// Set up all event listeners
function setupEventListeners() {
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
    
    toggleShiftButton.addEventListener('click', () => {
        toggleShiftView();
    });
    
    toggleStatsButton.addEventListener('click', () => {
        toggleStats();
    });
    
    secretButton.addEventListener('click', () => {
        toggleAnnualSection();
    });
    
    toggleAnnualStatsButton.addEventListener('click', () => {
        toggleAnnualStats();
    });
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
