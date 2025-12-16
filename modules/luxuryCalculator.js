import {
    luxurySection,
    luxuryForm,
    luxuryResult,
    hourlyRateInput,
    savingsAmountInput,
    luxuryProgressBar,
    luxuryProgressText,
    luxuryHoursNeeded,
    luxuryTimeEstimate,
    rateLabel
} from './domElements.js';
import { saveLuxuryDataToLocalStorage } from './storage.js';
import { getWorkingDays, getHoursPerDay } from './schedule.js';

// Toggle luxury calculator section
export function toggleLuxurySection() {
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
export function calculateLuxury() {
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
export function handlePaymentTypeChange() {
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
export function editLuxuryData() {
    luxuryForm.style.display = 'block';
    luxuryResult.style.display = 'none';
}
