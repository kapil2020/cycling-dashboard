class ChartManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.initCharts();
    }

    initCharts() {
        this.createWorldMap();
        this.createContinentChart();
        this.createTopCitiesChart();
        this.createScatterPlot();
    }

    createWorldMap() {
        const data = [{
            type: 'scattergeo',
            mode: 'markers',
            locations: this.dashboard.filteredData.map(row => row.country),
            locationmode: 'country names',
            text: this.dashboard.filteredData.map(row => 
                `${row.city}<br>Cycling: ${row.cycle}%<br>Motorcycle: ${row.motorcycle}%`
            ),
            marker: {
                size: this.dashboard.filteredData.map(row => Math.sqrt(row.cycle + row.motorcycle) * 2),
                color: this.dashboard.filteredData.map(row => row.cycle),
                colorscale: 'Viridis',
                colorbar: {
                    title: 'Cycling %'
                }
            },
            hoverinfo: 'text'
        }];

        const layout = {
            title: 'Global Mode Share Distribution',
            geo: {
                projection: {
                    type: 'natural earth'
                },
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                showcountries: true,
                countrycolor: 'rgb(255, 255, 255)'
            },
            margin: { t: 50, r: 0, b: 0, l: 0 }
        };

        Plotly.newPlot('worldMap', data, layout, { responsive: true });
    }

    createContinentChart() {
        const continentData = {};
        
        this.dashboard.filteredData.forEach(row => {
            if (!continentData[row.continent]) {
                continentData[row.continent] = { cycle: 0, motorcycle: 0, count: 0 };
            }
            continentData[row.continent].cycle += row.cycle;
            continentData[row.continent].motorcycle += row.motorcycle;
            continentData[row.continent].count += 1;
        });

        const continents = Object.keys(continentData);
        const avgCycle = continents.map(cont => continentData[cont].cycle / continentData[cont].count);
        const avgMotorcycle = continents.map(cont => continentData[cont].motorcycle / continentData[cont].count);

        const data = [{
            type: 'bar',
            x: continents,
            y: avgCycle,
            name: 'Average Cycling %',
            marker: { color: '#4361ee' }
        }, {
            type: 'bar',
            x: continents,
            y: avgMotorcycle,
            name: 'Average Motorcycle %',
            marker: { color: '#f72585' }
        }];

        const layout = {
            title: 'Average Mode Share by Continent',
            barmode: 'group',
            xaxis: { title: 'Continent' },
            yaxis: { title: 'Percentage (%)' }
        };

        Plotly.newPlot('continentChart', data, layout, { responsive: true });
    }

    createTopCitiesChart() {
        const sortedData = [...this.dashboard.filteredData]
            .sort((a, b) => b.cycle + b.motorcycle - (a.cycle + a.motorcycle))
            .slice(0, 15);

        const data = [{
            type: 'bar',
            y: sortedData.map(row => row.city),
            x: sortedData.map(row => row.cycle),
            name: 'Cycling %',
            orientation: 'h',
            marker: { color: '#4361ee' }
        }, {
            type: 'bar',
            y: sortedData.map(row => row.city),
            x: sortedData.map(row => row.motorcycle),
            name: 'Motorcycle %',
            orientation: 'h',
            marker: { color: '#f72585' }
        }];

        const layout = {
            title: 'Top 15 Cities by Total Mode Share',
            barmode: 'stack',
            xaxis: { title: 'Percentage (%)' },
            yaxis: { title: 'City', automargin: true },
            height: 400
        };

        Plotly.newPlot('topCitiesChart', data, layout, { responsive: true });
    }

    createScatterPlot() {
        const data = [{
            type: 'scatter',
            x: this.dashboard.filteredData.map(row => row.cycle),
            y: this.dashboard.filteredData.map(row => row.motorcycle),
            mode: 'markers',
            text: this.dashboard.filteredData.map(row => row.city),
            marker: {
                size: 8,
                color: this.dashboard.filteredData.map(row => 
                    row.continent === 'Europe' ? '#4361ee' :
                    row.continent === 'Asia' ? '#f72585' :
                    row.continent === 'North America' ? '#4cc9f0' :
                    row.continent === 'South America' ? '#4895ef' :
                    row.continent === 'Africa' ? '#b5179e' : '#3a0ca3'
                )
            }
        }];

        const layout = {
            title: 'Cycling vs Motorcycle Correlation',
            xaxis: { title: 'Cycling Percentage (%)' },
            yaxis: { title: 'Motorcycle Percentage (%)' },
            showlegend: false
        };

        Plotly.newPlot('scatterPlot', data, layout, { responsive: true });
    }

    updateCharts() {
        this.createWorldMap();
        this.createContinentChart();
        this.createTopCitiesChart();
        this.createScatterPlot();
    }
}

// Update ChartManager in app.js
// Add this to the CyclingDashboard class after the constructor
CyclingDashboard.prototype.updateCharts = function() {
    if (!this.chartManager) {
        this.chartManager = new ChartManager(this);
    } else {
        this.chartManager.updateCharts();
    }
};