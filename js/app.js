class CyclingDashboard {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.filters = {
            continent: 'all',
            country: 'all',
            dataType: 'train', // Default to Training Data
            mode: 'both'       // Default to Both modes
        };
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.setupComparisonTool();
        this.updateFilters();
        this.updateDashboard();
        this.hideLoading();
    }

    cleanData(data) {
        return data.filter(row => row.city && row.country).map(row => {
            // Replace 99999999 placeholders with 0
            let motorcycle = parseFloat(row.motorcycle) || 0;
            let cycle = parseFloat(row.cycle) || 0;
            
            // Clean motorcycle data (99999999 is clearly a placeholder)
            if (motorcycle > 1000) motorcycle = 0;
            if (motorcycle > 100) motorcycle = 0; // Percentage can't be > 100%
            
            // Clean cycle data
            if (cycle > 100) cycle = 0;
            
            return {
                ...row,
                cycle: cycle,
                motorcycle: motorcycle,
                ratio: cycle / (motorcycle || 1) // Avoid division by zero
            };
        });
    }

    async loadData() {
        try {
            const response = await fetch('data/filtered_data_2025-09-27.csv');
            const csvText = await response.text();
            
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    const cleanedData = this.cleanData(results.data);
                    this.data = cleanedData;
                    this.filteredData = [...this.data];
                }
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupEventListeners() {
        // Set default radio button selection
        document.getElementById('bothModes').checked = true;
        document.getElementById('dataTypeFilter').value = 'train';

        // Filter event listeners
        document.getElementById('continentFilter').addEventListener('change', (e) => {
            this.filters.continent = e.target.value;
            this.updateFilters();
            this.updateDashboard();
        });

        document.getElementById('countryFilter').addEventListener('change', (e) => {
            this.filters.country = e.target.value;
            this.updateDashboard();
        });

        document.getElementById('dataTypeFilter').addEventListener('change', (e) => {
            this.filters.dataType = e.target.value;
            this.updateDashboard();
        });

        // Mode filter radio buttons
        document.querySelectorAll('input[name="modeFilter"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.mode = e.target.id.replace('Mode', '');
                this.updateDashboard();
            });
        });

        // Reset filters
        document.getElementById('resetFilters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Search table
        document.getElementById('searchTable').addEventListener('input', (e) => {
            this.filterTable(e.target.value);
        });

        // Mobile menu close on click
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarNav = document.querySelector('.navbar-collapse');
                if (navbarToggler && navbarNav.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }

    setupComparisonTool() {
        // Populate city selects
        this.updateCitySelects();
        
        // Add event listeners for city selection
        document.getElementById('city1Select').addEventListener('change', (e) => {
            this.updateComparison();
        });
        
        document.getElementById('city2Select').addEventListener('change', (e) => {
            this.updateComparison();
        });
    }

    updateCitySelects() {
        const city1Select = document.getElementById('city1Select');
        const city2Select = document.getElementById('city2Select');
        
        // Clear existing options except first
        city1Select.innerHTML = '<option value="">Select City 1</option>';
        city2Select.innerHTML = '<option value="">Select City 2</option>';
        
        this.data.forEach(city => {
            const option1 = new Option(`${city.city}, ${city.country}`, city.city);
            const option2 = new Option(`${city.city}, ${city.country}`, city.city);
            
            city1Select.add(option1);
            city2Select.add(option2);
        });
    }

    updateComparison() {
        const city1Name = document.getElementById('city1Select').value;
        const city2Name = document.getElementById('city2Select').value;
        
        const city1 = this.data.find(c => c.city === city1Name);
        const city2 = this.data.find(c => c.city === city2Name);
        
        this.displayComparison(city1, city2);
    }

    displayComparison(city1, city2) {
        const city1Data = document.getElementById('city1Data');
        const city2Data = document.getElementById('city2Data');
        
        if (city1) {
            city1Data.innerHTML = `
                <h5>${city1.city}, ${city1.country}</h5>
                <div class="mb-2">
                    <span class="badge bg-primary">${city1.type_cycle}</span>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="text-primary">
                            <i class="fas fa-bicycle fa-2x mb-2"></i>
                            <h4>${city1.cycle.toFixed(1)}%</h4>
                            <small>Cycling</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="text-warning">
                            <i class="fas fa-motorcycle fa-2x mb-2"></i>
                            <h4>${city1.motorcycle.toFixed(1)}%</h4>
                            <small>Motorcycle</small>
                        </div>
                    </div>
                </div>
                <div class="mt-2">
                    <small class="text-muted">Ratio: ${city1.ratio.toFixed(2)}:1</small>
                </div>
            `;
        } else {
            city1Data.innerHTML = '<p class="text-muted">Select a city to compare</p>';
        }
        
        if (city2) {
            city2Data.innerHTML = `
                <h5>${city2.city}, ${city2.country}</h5>
                <div class="mb-2">
                    <span class="badge bg-primary">${city2.type_cycle}</span>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="text-primary">
                            <i class="fas fa-bicycle fa-2x mb-2"></i>
                            <h4>${city2.cycle.toFixed(1)}%</h4>
                            <small>Cycling</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="text-warning">
                            <i class="fas fa-motorcycle fa-2x mb-2"></i>
                            <h4>${city2.motorcycle.toFixed(1)}%</h4>
                            <small>Motorcycle</small>
                        </div>
                    </div>
                </div>
                <div class="mt-2">
                    <small class="text-muted">Ratio: ${city2.ratio.toFixed(2)}:1</small>
                </div>
            `;
        } else {
            city2Data.innerHTML = '<p class="text-muted">Select a city to compare</p>';
        }
    }

    updateFilters() {
        this.updateContinentFilter();
        this.updateCountryFilter();
    }

    updateContinentFilter() {
        const continentFilter = document.getElementById('continentFilter');
        const continents = [...new Set(this.data.map(row => row.continent))].filter(Boolean);
        
        continentFilter.innerHTML = '<option value="all">All Continents</option>';
        continents.forEach(continent => {
            const option = document.createElement('option');
            option.value = continent;
            option.textContent = continent;
            continentFilter.appendChild(option);
        });
        
        continentFilter.value = this.filters.continent;
    }

    updateCountryFilter() {
        const countryFilter = document.getElementById('countryFilter');
        let countries = this.data;
        
        if (this.filters.continent !== 'all') {
            countries = countries.filter(row => row.continent === this.filters.continent);
        }
        
        countries = [...new Set(countries.map(row => row.country))].filter(Boolean);
        
        countryFilter.innerHTML = '<option value="all">All Countries</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
        
        countryFilter.value = this.filters.country;
    }

    filterData() {
        this.filteredData = this.data.filter(row => {
            const continentMatch = this.filters.continent === 'all' || row.continent === this.filters.continent;
            const countryMatch = this.filters.country === 'all' || row.country === this.filters.country;
            
            // Fix data type filter logic
            let dataTypeMatch = true;
            if (this.filters.dataType !== 'all') {
                dataTypeMatch = row.type_cycle === this.filters.dataType;
            }
            
            return continentMatch && countryMatch && dataTypeMatch;
        });
    }

    updateDashboard() {
        this.filterData();
        this.updateStatistics();
        this.updateCharts();
        this.updateTable();
    }

    updateStatistics() {
        if (this.filteredData.length === 0) {
            // Handle empty data case
            document.getElementById('totalCities').textContent = '0';
            document.getElementById('totalCountries').textContent = '0';
            document.getElementById('avgCycle').textContent = '0%';
            document.getElementById('avgMotorcycle').textContent = '0%';
            
            document.getElementById('topCycleCity').textContent = '-';
            document.getElementById('topCycleValue').textContent = '0%';
            
            document.getElementById('topMotorcycleCity').textContent = '-';
            document.getElementById('topMotorcycleValue').textContent = '0%';
            
            document.getElementById('dataCoverage').textContent = '0';
            
            document.getElementById('highestRatioCity').textContent = '-';
            document.getElementById('highestRatio').textContent = '0:1';
            return;
        }

        // Total cities and countries
        document.getElementById('totalCities').textContent = this.filteredData.length;
        document.getElementById('totalCountries').textContent = 
            new Set(this.filteredData.map(row => row.country)).size;

        // Average percentages
        const avgCycle = this.filteredData.reduce((sum, row) => sum + row.cycle, 0) / this.filteredData.length;
        const avgMotorcycle = this.filteredData.reduce((sum, row) => sum + row.motorcycle, 0) / this.filteredData.length;
        
        document.getElementById('avgCycle').textContent = avgCycle.toFixed(1) + '%';
        document.getElementById('avgMotorcycle').textContent = avgMotorcycle.toFixed(1) + '%';

        // Top cities
        const topCycle = this.filteredData.reduce((max, row) => row.cycle > max.cycle ? row : max, this.filteredData[0]);
        const topMotorcycle = this.filteredData.reduce((max, row) => row.motorcycle > max.motorcycle ? row : max, this.filteredData[0]);
        
        document.getElementById('topCycleCity').textContent = topCycle.city || '-';
        document.getElementById('topCycleValue').textContent = topCycle.cycle.toFixed(1) + '%';
        
        document.getElementById('topMotorcycleCity').textContent = topMotorcycle.city || '-';
        document.getElementById('topMotorcycleValue').textContent = topMotorcycle.motorcycle.toFixed(1) + '%';

        // Data coverage
        document.getElementById('dataCoverage').textContent = this.filteredData.length;

        // Highest ratio (excluding infinity)
        const validRatios = this.filteredData.filter(row => isFinite(row.ratio));
        const highestRatio = validRatios.length > 0 ? 
            validRatios.reduce((max, row) => row.ratio > max.ratio ? row : max, validRatios[0]) : 
            { city: '-', ratio: 0 };
            
        document.getElementById('highestRatioCity').textContent = highestRatio.city || '-';
        document.getElementById('highestRatio').textContent = highestRatio.ratio.toFixed(2) + ':1';
    }

    updateTable() {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        this.filteredData.forEach(row => {
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
            `;
            tableBody.appendChild(tr);
        });
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#tableBody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    resetFilters() {
        this.filters = {
            continent: 'all',
            country: 'all',
            dataType: 'train',
            mode: 'both'
        };
        
        document.getElementById('continentFilter').value = 'all';
        document.getElementById('countryFilter').value = 'all';
        document.getElementById('dataTypeFilter').value = 'train';
        document.getElementById('bothModes').checked = true;
        
        this.updateFilters();
        this.updateDashboard();
    }

    updateCharts() {
        if (!this.chartManager) {
            this.chartManager = new ChartManager(this);
        } else {
            this.chartManager.updateCharts();
        }
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loadingSpinner').classList.add('hidden');
        }, 500);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new CyclingDashboard();
});
