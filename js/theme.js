class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const darkModeStyle = document.getElementById('dark-mode-style');
        
        if (theme === 'dark') {
            darkModeStyle.removeAttribute('disabled');
            document.querySelector('#themeToggle i').className = 'fas fa-sun';
        } else {
            darkModeStyle.setAttribute('disabled', 'true');
            document.querySelector('#themeToggle i').className = 'fas fa-moon';
        }
        
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // Update chart themes if they exist
        if (window.dashboard && window.dashboard.chartManager) {
            setTimeout(() => {
                window.dashboard.chartManager.updateCharts();
            }, 100);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
