class CyclingDashboard {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.filters = {
            continent: 'all',
            country: 'all',
            dataType: 'all',
            mode: 'cycle'
        };
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateFilters();
        this.updateDashboard();
        this.hideLoading();
    }

    async loadData() {
        try {
            const response = await fetch('data/filtered_data_2025-09-27.csv');
            const csvText = await response.text();
            
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    this.data = results.data
                        .filter(row => row.city && row.country)
                        .map(row => ({
                            ...row,
                            cycle: parseFloat(row.cycle) || 0,
                            motorcycle: parseFloat(row.motorcycle) || 0,
                            ratio: (parseFloat(row.cycle) || 0) / (parseFloat(row.motorcycle) || 1)
                        }));
                    
                    this.filteredData = [...this.data];
                }
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupEventListeners() {
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
            const dataTypeMatch = this.filters.dataType === 'all' || 
                                (row.type_cycle && row.type_cycle.includes(this.filters.dataType));
            
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
        const topCycle = this.filteredData.reduce((max, row) => row.cycle > max.cycle ? row : max, {cycle: 0});
        const topMotorcycle = this.filteredData.reduce((max, row) => row.motorcycle > max.motorcycle ? row : max, {motorcycle: 0});
        
        document.getElementById('topCycleCity').textContent = topCycle.city || '-';
        document.getElementById('topCycleValue').textContent = topCycle.cycle.toFixed(1) + '%';
        
        document.getElementById('topMotorcycleCity').textContent = topMotorcycle.city || '-';
        document.getElementById('topMotorcycleValue').textContent = topMotorcycle.motorcycle.toFixed(1) + '%';

        // Data coverage
        document.getElementById('dataCoverage').textContent = this.filteredData.length;

        // Highest ratio
        const highestRatio = this.filteredData.reduce((max, row) => row.ratio > max.ratio ? row : max, {ratio: 0});
        document.getElementById('highestRatioCity').textContent = highestRatio.city || '-';
        document.getElementById('highestRatio').textContent = highestRatio.ratio.toFixed(1) + ':1';
    }

    updateTable() {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        this.filteredData.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'fade-in';
            tr.innerHTML = `
                <td>${row.city}</td>
                <td>${row.country}</td>
                <td>${row.continent}</td>
                <td><span class="badge bg-primary">${row.type_cycle}</span></td>
                <td>${row.cycle.toFixed(1)}%</td>
                <td>${row.motorcycle.toFixed(1)}%</td>
                <td>${row.ratio.toFixed(2)}</td>
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
            dataType: 'all',
            mode: 'cycle'
        };
        
        document.getElementById('continentFilter').value = 'all';
        document.getElementById('countryFilter').value = 'all';
        document.getElementById('dataTypeFilter').value = 'all';
        document.getElementById('cycleMode').checked = true;
        
        this.updateFilters();
        this.updateDashboard();
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loadingSpinner').classList.add('hidden');
        }, 1000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new CyclingDashboard();
});