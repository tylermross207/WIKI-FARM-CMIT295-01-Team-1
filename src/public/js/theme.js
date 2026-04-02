// Theme definitions - must match server-side themes
const THEMES = {
  burgundy: {
    primary: '#5b0b0b',
    primaryDark: '#3a0303',
    primaryLight: '#f3e8e8',
    accent: '#8b2b2b',
    danger: '#a71d2a',
    text: '#2d1b1b',
    textMuted: '#6b4b4b',
    border: '#e6d9cf',
    bg: '#fbf2e6'
  },
  ocean: {
    primary: '#0066cc',
    primaryDark: '#004499',
    primaryLight: '#e6f2ff',
    accent: '#0099ff',
    danger: '#ff3333',
    text: '#1a1a2e',
    textMuted: '#666699',
    border: '#ccddff',
    bg: '#f5f9ff'
  },
  forest: {
    primary: '#1b5e20',
    primaryDark: '#0d3818',
    primaryLight: '#e8f5e9',
    accent: '#2e7d32',
    danger: '#c62828',
    text: '#1b5e20',
    textMuted: '#558b2f',
    border: '#c8e6c9',
    bg: '#f1f8e9'
  },
  sunset: {
    primary: '#e65100',
    primaryDark: '#bf360c',
    primaryLight: '#ffe0b2',
    accent: '#ff6f00',
    danger: '#d32f2f',
    text: '#bf360c',
    textMuted: '#e65100',
    border: '#ffe0b2',
    bg: '#fff3e0'
  },
  purple: {
    primary: '#6a1b9a',
    primaryDark: '#4a148c',
    primaryLight: '#f3e5f5',
    accent: '#9c27b0',
    danger: '#e91e63',
    text: '#4a148c',
    textMuted: '#7b1fa2',
    border: '#e1bee7',
    bg: '#faf5ff'
  },
  slate: {
    primary: '#37474f',
    primaryDark: '#1c1f26',
    primaryLight: '#eceff1',
    accent: '#546e7a',
    danger: '#d32f2f',
    text: '#1c1f26',
    textMuted: '#455a64',
    border: '#b0bec5',
    bg: '#f5f6f7'
  }
};

function applyTheme(themeName) {
  const theme = THEMES[themeName] || THEMES.burgundy;
  const root = document.documentElement;
  
  // Apply all CSS variables
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-dark', theme.primaryDark);
  root.style.setProperty('--primary-light', theme.primaryLight);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--danger', theme.danger);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--text-muted', theme.textMuted);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--bg', theme.bg);
  
  // Update body background color for better visibility
  document.body.style.backgroundColor = theme.bg;
  
  // Save to localStorage
  localStorage.setItem('wiki-farm-theme', themeName);
  
  // Update theme selector if it exists
  const selector = document.getElementById('theme-selector');
  if (selector) {
    selector.value = themeName;
  }
}

function loadSavedTheme() {
  const saved = localStorage.getItem('wiki-farm-theme');
  if (saved && THEMES[saved]) {
    applyTheme(saved);
  }
  
  // Load dark mode preference
  const isDarkMode = localStorage.getItem('wiki-farm-dark-mode') === 'true';
  if (isDarkMode) {
    enableDarkMode();
  }
}

function toggleDarkMode() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  if (isDarkMode) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  const btn = document.getElementById('dark-mode-btn');
  if (btn) {
    btn.textContent = '☀️';
    btn.title = 'Toggle Light Mode';
  }
  localStorage.setItem('wiki-farm-dark-mode', 'true');
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  const btn = document.getElementById('dark-mode-btn');
  if (btn) {
    btn.textContent = '🌙';
    btn.title = 'Toggle Dark Mode';
  }
  localStorage.setItem('wiki-farm-dark-mode', 'false');
}

// Load theme on page load
document.addEventListener('DOMContentLoaded', loadSavedTheme);
