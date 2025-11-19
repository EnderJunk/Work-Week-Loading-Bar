import { submitButton, editScheduleButton, editScheduleButtonBottom, toggleShiftButton } from './modules/domElements.js';
import { updateProgress, toggleShiftView } from './modules/uiUpdater.js';
import { saveScheduleToLocalStorage, loadScheduleFromLocalStorage } from './modules/storage.js';
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
    
    // Initial progress update
    updateProgress();
    
    // Auto-update every minute
    setInterval(updateProgress, 60000);
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
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
