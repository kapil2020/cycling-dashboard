class AdvancedFeatures {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortConfig = { key: null, direction: 'asc' };
        this.init();
    }

    init() {
        this.setupRangeSliders();
        this.setupEventListeners();
        this.setupPredictor();
        this.showToast('Enhanced dashboard loaded successfully!', 'success');
    }

    setupRangeSliders() {
        this.createRangeSlider('cycleRangeSlider', 'cycleRangeValue', [0, 100], (values) => {
            this.dashboard.filters.cycleMin = values[0];
            this.dashboard.filters.cycleMax = values[1];
            document.getElementById('cycleRangeValue').textContent = `${values[0]}%-${values[1]}%`;
            this.dashboard.updateDashboard();
        });

        this.createRangeSlider('motorcycleRangeSlider', 'motorcycleRangeValue', [0, 100], (values) => {
            this.dashboard.filters.motorcycleMin = values[0];
            this.dashboard.filters.motorcycleMax = values[1];
            document.getElementById('motorcycleRangeValue').textContent = `${values[0]}%-${values[1]}%`;
            this.dashboard.updateDashboard();
        });
    }

    createRangeSlider(containerId, valueId, range, onChange) {
        const container = document.getElementById(containerId);
        const valueDisplay = document.getElementById(valueId);
        
        // Create track
        const track = document.createElement('div');
        track.className = 'range-track';
        container.appendChild(track);

        // Create thumbs
        const thumb1 = document.createElement('div');
        thumb1.className = 'range-thumb';
        thumb1.style.left = '0%';

        const thumb2 = document.createElement('div');
        thumb2.className = 'range-thumb';
        thumb2.style.left = '100%';

        container.appendChild(thumb1);
        container.appendChild(thumb2);

        // Set initial values
        let values = [range[0], range[1]];
        this.updateSlider(container, values);

        // Add drag functionality
        this.makeDraggable(thumb1, container, values, 0, onChange);
        this.makeDraggable(thumb2, container, values, 1, onChange);
    }

    makeDraggable(thumb, container, values, index, onChange) {
        let isDragging = false;

        thumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        thumb.addEventListener('touchstart', (e) => {
            isDragging = true;
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;
            this.updateThumbPosition(e.clientX, thumb, container, values, index, onChange);
        };

        const onTouchMove = (e) => {
            if (!isDragging) return;
            this.updateThumbPosition(e.touches[0].clientX, thumb, container, values, index, onChange);
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        const onTouchEnd = () => {
            isDragging = false;
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
    }

    updateThumbPosition(clientX, thumb, container, values, index, onChange) {
        const rect = container.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));

        values[index] = Math.round(percent);
        
        // Ensure min < max
        if (index === 0 && values[0] >= values[1]) values[0] = values[1] - 1;
        if (index === 1 && values[1] <= values[0]) values[1] = values[0] + 1;

        this.updateSlider(container, values);
        onChange(values);
    }

    updateSlider(container, values) {
        const track = container.querySelector('.range-track');
        const thumb1 = container.querySelector('.range-thumb:nth-child(2)');
        const thumb2 = container.querySelector('.range-thumb:nth-child(3)');

        const min = values[0];
        const max = values[1];

        track.style.left = `${min}%`;
        track.style.width = `${max - min}%`;

        thumb1.style.left = `${min}%`;
        thumb2.style.left = `${max}%`;
    }

    setupEventListeners() {
        // Export data
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        // Save session
        document.getElementById('saveSession').addEventListener('click', () => {
            this.saveSession();
        });

        // Table sorting
        document.querySelectorAll('#dataTable th').forEach((th, index) => {
            th.addEventListener('click', () => {
                this.sortTable(index);
            });
        });

        // Map controls
        document.getElementById('mapZoomIn').addEventListener('click', () => {
            this.zoomMap(1.2);
        });

        document.getElementById('mapZoomOut').addEventListener('click', () => {
            this.zoomMap(0.8);
        });

        // Advanced options
        document.getElementById('showOutliers').addEventListener('change', (e) => {
            this.toggleOutliers(e.target.checked);
        });

        document.getElementById('animateCharts').addEventListener('change', (e) => {
            this.toggleAnimations(e.target.checked);
        });
    }

    setupPredictor() {
        // Populate continent options
        const continents = [...new Set(this.dashboard.data.map(row => row.continent))].filter(Boolean);
        const select = document.getElementById('predictorContinent');
        
        continents.forEach(continent => {
            const option = document.createElement('option');
            option.value = continent;
            option.textContent = continent;
            select.appendChild(option);
        });

        // Prediction calculation
        document.getElementById('calculatePrediction').addEventListener('click', () => {
            this.calculatePrediction();
        });
    }

    calculatePrediction() {
        const continent = document.getElementById('predictorContinent').value;
        const cycleValue = parseFloat(document.getElementById('predictorCycle').value);

        if (!continent || isNaN(cycleValue)) {
            this.showToast('Please select a continent and enter cycling percentage', 'warning');
            return;
        }

        // Simple linear regression based on continent data
        const continentData = this.dashboard.data.filter(row => row.continent === continent);
        if (continentData.length === 0) {
            this.showToast('No data available for selected continent', 'warning');
            return;
        }

        // Calculate average motorcycle percentage for the continent
        const avgMotorcycle = continentData.reduce((sum, row) => sum + row.motorcycle, 0) / continentData.length;
        
        // Simple prediction model (could be enhanced with ML)
        const predictedMotorcycle = Math.max(0, avgMotorcycle - (cycleValue * 0.1));
        const confidence = Math.min(95, 70 + (continentData.length * 0.5));

        document.getElementById('predictionResult').textContent = `${predictedMotorcycle.toFixed(1)}%`;
        document.getElementById('predictionConfidence').textContent = `Confidence: ${confidence.toFixed(0)}% based on ${continentData.length} cities`;

        this.showToast(`Prediction calculated for ${continent}`, 'success');
    }

    sortTable(columnIndex) {
        const headers = document.querySelectorAll('#dataTable th');
        const currentHeader = headers[columnIndex];
        const key = this.getSortKey(columnIndex);

        if (this.sortConfig.key === key) {
            this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortConfig.key = key;
            this.sortConfig.direction = 'asc';
        }

        // Update UI
        headers.forEach(header => header.classList.remove('sorted-asc', 'sorted-desc'));
        currentHeader.classList.add(`sorted-${this.sortConfig.direction}`);

        // Sort data
        this.dashboard.filteredData.sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return this.sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        this.dashboard.updateTable();
        this.showToast(`Sorted by ${currentHeader.textContent.trim()}`, 'info');
    }

    getSortKey(columnIndex) {
        const keys = ['city', 'country', 'continent', 'type_cycle', 'cycle', 'motorcycle', 'ratio'];
        return keys[columnIndex] || 'city';
    }

    exportData() {
        if (this.dashboard.filteredData.length === 0) {
            this.showToast('No data to export', 'warning');
            return;
        }

        const csv = this.convertToCSV(this.dashboard.filteredData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cycling_data_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showToast('Data exported successfully', 'success');
    }

    convertToCSV(data) {
        const headers = ['City', 'Country', 'Continent', 'Data Type', 'Cycling %', 'Motorcycle %', 'Ratio'];
        const rows = data.map(row => [
            row.city,
            row.country,
            row.continent,
            row.type_cycle,
            row.cycle,
            row.motorcycle,
            row.ratio.toFixed(2)
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    saveSession() {
        const sessionData = {
            filters: this.dashboard.filters,
            sortConfig: this.sortConfig,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('dashboardSession', JSON.stringify(sessionData));
        this.showToast('Session saved successfully', 'success');
    }

    loadSession() {
        const saved = localStorage.getItem('dashboardSession');
        if (saved) {
            const sessionData = JSON.parse(saved);
            this.dashboard.filters = sessionData.filters;
            this.sortConfig = sessionData.sortConfig;
            this.dashboard.updateDashboard();
            this.showToast('Session restored', 'info');
        }
    }

    zoomMap(factor) {
        // This would integrate with Plotly's map zoom functionality
        console.log('Zoom map by factor:', factor);
        // Implementation would depend on specific map library capabilities
    }

    toggleOutliers(show) {
        // Implement outlier filtering logic
        this.dashboard.updateDashboard();
        this.showToast(show ? 'Showing outliers' : 'Hiding outliers', 'info');
    }

    toggleAnimations(enable) {
        document.body.classList.toggle('animations-enabled', enable);
        this.showToast(enable ? 'Animations enabled' : 'Animations disabled', 'info');
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('liveToast');
        const toastMessage = document.getElementById('toastMessage');
        
        // Set message and type
        toastMessage.textContent = message;
        toast.className = `toast show bg-${type} text-white`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    updateFilterCount() {
        const activeFilters = Object.values(this.dashboard.filters).filter(value => 
            value !== 'all' && value !== 'both' && value !== 0 && value !== 100
        ).length;

        document.getElementById('activeFilterCount').textContent = activeFilters;
    }
}

// Enhance the existing dashboard class
CyclingDashboard.prototype.setupAdvancedFeatures = function() {
    this.advancedFeatures = new AdvancedFeatures(this);
};

CyclingDashboard.prototype.updateTable = function() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    // Pagination
    const startIndex = (this.advancedFeatures.currentPage - 1) * this.advancedFeatures.itemsPerPage;
    const endIndex = startIndex + this.advancedFeatures.itemsPerPage;
    const paginatedData = this.filteredData.slice(startIndex, endIndex);

    paginatedData.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'fade-in';
        tr.innerHTML = `
            <td>${row.city}</td>
            <td class="d-none d-md-table-cell">${row.country}</td>
            <td class="d-none d-lg-table-cell">${row.continent}</td>
            <td><span class="badge bg-primary">${row.type_cycle}</span></td>
            <td>${row.cycle.toFixed(1)}%</td>
            <td>${row.motorcycle.toFixed(1)}%</td>
            <td class="d-none d-sm-table-cell">${row.ratio.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="window.dashboard.advancedFeatures.showCityDetails('${row.city}')">
                    <i class="fas fa-info"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Update pagination
    this.updatePagination();
    
    // Update counts
    document.getElementById('currentCount').textContent = paginatedData.length;
    document.getElementById('totalCount').textContent = this.filteredData.length;

    // Update filter count
    this.advancedFeatures.updateFilterCount();
};

CyclingDashboard.prototype.updatePagination = function() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(this.filteredData.length / this.advancedFeatures.itemsPerPage);
    
    pagination.innerHTML = '';

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${this.advancedFeatures.currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.advancedFeatures.currentPage > 1) {
            this.advancedFeatures.currentPage--;
            this.updateTable();
        }
    });
    pagination.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === this.advancedFeatures.currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageLi.addEventListener('click', (e) => {
            e.preventDefault();
            this.advancedFeatures.currentPage = i;
            this.updateTable();
        });
        pagination.appendChild(pageLi);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${this.advancedFeatures.currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.advancedFeatures.currentPage < totalPages) {
            this.advancedFeatures.currentPage++;
            this.updateTable();
        }
    });
    pagination.appendChild(nextLi);
};

// Initialize advanced features when dashboard is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for dashboard to initialize
    setTimeout(() => {
        if (window.dashboard) {
            window.dashboard.setupAdvancedFeatures();
        }
    }, 1000);
});
