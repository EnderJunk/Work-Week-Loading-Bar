import {
    settingsPanel,
    editScheduleButton,
    editScheduleButtonBottom
} from './domElements.js';

// Collapse the settings panel
export function collapseSettings() {
    settingsPanel.style.display = 'none';
    editScheduleButton.style.display = 'none';
    editScheduleButtonBottom.style.display = 'block';
}

// Expand the settings panel
export function expandSettings() {
    settingsPanel.style.display = 'block';
    editScheduleButton.style.display = 'none';
    editScheduleButtonBottom.style.display = 'none';
}
