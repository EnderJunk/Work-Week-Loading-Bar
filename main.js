import { submitButton, editScheduleButton, editScheduleButtonBottom, toggleShiftButton, toggleStatsButton, progressStats } from './modules/domElements.js';
import { updateProgress, toggleShiftView } from './modules/uiUpdater.js';
import { saveScheduleToLocalStorage, loadScheduleFromLocalStorage, saveStatsVisibility, loadStatsVisibility } from './modules/storage.js';
import { collapseSettings, expandSettings } from './modules/uiControls.js';

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
    if (!statsVisible) {
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
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
