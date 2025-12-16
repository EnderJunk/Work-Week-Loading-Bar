import { submitButton, editScheduleButton, editScheduleButtonBottom, toggleShiftButton, toggleStatsButton, progressStats, secretButton, mysteryButton, annualSection, annualProgressBar, annualProgressText, annualHoursRemainingText, startTimeInput, endTimeInput, luxurySection, luxuryForm, luxuryResult, hourlyRateInput, savingsAmountInput, calculateLuxuryButton, luxuryProgressBar, luxuryProgressText, luxuryHoursNeeded, luxuryTimeEstimate, rateLabel, paymentTypeRadios, editLuxuryButton } from './modules/domElements.js';
import { updateProgress, toggleShiftView } from './modules/uiUpdater.js';
import { saveScheduleToLocalStorage, loadScheduleFromLocalStorage, saveStatsVisibility, loadStatsVisibility, saveLuxuryDataToLocalStorage, loadLuxuryDataFromLocalStorage } from './modules/storage.js';
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
    
    // Load luxury data if exists
    loadLuxuryDataFromLocalStorage();
    
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
    
    // Show/hide mystery button based on annual section visibility
    mysteryButton.style.display = isVisible ? 'none' : 'block';
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

// Toggle luxury calculator section
function toggleLuxurySection() {
    const isVisible = luxurySection.style.display !== 'none';
    luxurySection.style.display = isVisible ? 'none' : 'block';
    
    // If opening and data is saved, auto-calculate
    if (!isVisible) {
        const savedData = localStorage.getItem('luxuryData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.rate && parseFloat(data.rate) > 0) {
                    // Data exists, show results directly
                    calculateLuxury();
                }
            } catch (e) {
                // If error, just show the form
            }
        }
    }
}

// Calculate luxury car savings
function calculateLuxury() {
    console.log('Calculate luxury called');
    const paymentType = document.querySelector('input[name="payment-type"]:checked').value;
    const rateValue = parseFloat(hourlyRateInput.value) || 0;
    const savings = parseFloat(savingsAmountInput.value) || 0;
    
    console.log('Payment type:', paymentType, 'Rate:', rateValue, 'Savings:', savings);
    
    if (rateValue <= 0) {
        alert('Please enter a valid rate!');
        return;
    }
    
    // Save to local storage
    saveLuxuryDataToLocalStorage();
    
    const target = 600000;
    const remaining = Math.max(0, target - savings);
    
    // Calculate hourly rate
    let hourlyRate;
    if (paymentType === 'salary') {
        // Get working days and hours per day from schedule
        const workingDays = getWorkingDays();
        const hoursPerDay = getHoursPerDay();
        
        // Calculate annual working hours
        const workingDaysPerYear = workingDays.length * 52; // rough estimate
        const annualWorkingHours = workingDaysPerYear * hoursPerDay;
        
        hourlyRate = rateValue / annualWorkingHours;
    } else {
        hourlyRate = rateValue;
    }
    
    const hoursNeeded = Math.ceil(remaining / hourlyRate);
    const percentage = Math.min(100, ((savings / target) * 100).toFixed(1));
    
    // Get working days and hours per day from schedule
    const workingDays = getWorkingDays();
    const hoursPerDay = getHoursPerDay();
    
    // Calculate time estimate
    const workingDaysPerYear = workingDays.length * 52;
    const hoursPerYear = workingDaysPerYear * hoursPerDay;
    const years = (hoursNeeded / hoursPerYear).toFixed(1);
    
    // Hide form and show result
    luxuryForm.style.display = 'none';
    luxuryResult.style.display = 'block';
    
    // Update UI
    luxuryProgressBar.style.width = `${percentage}%`;
    luxuryProgressText.textContent = `${percentage}%`;
    luxuryHoursNeeded.textContent = `${hoursNeeded.toLocaleString()} hours of work needed`;
    luxuryTimeEstimate.textContent = `Approximately ${years} years at your current schedule`;
}

// Handle payment type change
function handlePaymentTypeChange() {
    const paymentType = document.querySelector('input[name="payment-type"]:checked').value;
    if (paymentType === 'salary') {
        rateLabel.textContent = 'Annual Salary ($):';
        hourlyRateInput.placeholder = '50000';
    } else {
        rateLabel.textContent = 'Hourly Rate ($):';
        hourlyRateInput.placeholder = '25.00';
    }
}

// Show luxury form to edit data
function editLuxuryData() {
    luxuryForm.style.display = 'block';
    luxuryResult.style.display = 'none';
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
        [secretButton, toggleAnnualSection],
        [mysteryButton, toggleLuxurySection],
        [calculateLuxuryButton, calculateLuxury],
        [editLuxuryButton, editLuxuryData]
    ];
    
    eventMap.forEach(([button, handler]) => {
        if (button) {
            button.addEventListener('click', handler);
        }
    });
    
    // Add payment type radio listeners
    if (paymentTypeRadios) {
        paymentTypeRadios.forEach(radio => {
            radio.addEventListener('change', handlePaymentTypeChange);
        });
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
