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
        this.createDistributionChart();
        this.createClusterChart();
    }

    createWorldMap() {
        // Filter out extreme outliers for better visualization
        const displayData = this.dashboard.filteredData.filter(row => 
            row.motorcycle <= 100 && row.cycle <= 100
        );

        if (displayData.length === 0) {
            document.getElementById('worldMap').innerHTML = '<p class="text-center text-muted py-5">No data available for current filters</p>';
            return;
        }

        const data = [{
            type: 'scattergeo',
            mode: 'markers',
            locations: displayData.map(row => row.country),
            locationmode: 'country names',
            text: displayData.map(row => 
                `${row.city}, ${row.country}<br>🚲 Cycling: ${row.cycle.toFixed(1)}%<br>🏍️ Motorcycle: ${row.motorcycle.toFixed(1)}%<br>📊 Data Type: ${row.type_cycle}`
            ),
            marker: {
                size: displayData.map(row => {
                    const total = row.cycle + row.motorcycle;
                    return Math.min(Math.sqrt(total) * 3, 20); // Cap size at 20
                }),
                color: displayData.map(row => row.cycle),
                colorscale: 'Viridis',
                cmin: 0,
                cmax: 50, // Cap color scale at 50% for better contrast
                colorbar: {
                    title: 'Cycling %',
                    thickness: 10
                },
                line: {
                    color: 'rgba(0,0,0,0.3)',
                    width: 1
                }
            },
            hoverinfo: 'text',
            hoverlabel: {
                bgcolor: 'white',
                font: { color: 'black' }
            }
        }];

        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        const layout = {
            title: {
                text: 'Global Mode Share Distribution',
                font: { size: 16 }
            },
            geo: {
                projection: { type: 'natural earth' },
                showland: true,
                landcolor: isDarkMode ? 'rgb(100, 100, 100)' : 'rgb(217, 217, 217)',
                showcountries: true,
                countrycolor: isDarkMode ? 'rgb(200, 200, 200)' : 'rgb(255, 255, 255)',
                showocean: true,
                oceancolor: isDarkMode ? 'rgb(50, 50, 70)' : 'rgb(212, 236, 255)',
                countrywidth: 0.5,
                bgcolor: 'rgba(0,0,0,0)'
            },
            margin: { t: 50, r: 0, b: 0, l: 0 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                color: isDarkMode ? 'white' : 'black'
            }
        };

        Plotly.newPlot('worldMap', data, layout, { 
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
        });
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
        
        if (continents.length === 0) {
            document.getElementById('continentChart').innerHTML = '<p class="text-center text-muted py-5">No data available for current filters</p>';
            return;
        }

        const avgCycle = continents.map(cont => continentData[cont].cycle / continentData[cont].count);
        const avgMotorcycle = continents.map(cont => continentData[cont].motorcycle / continentData[cont].count);

        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
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
            xaxis: { 
                title: 'Continent',
                tickangle: -45
            },
            yaxis: { title: 'Percentage (%)' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                color: isDarkMode ? 'white' : 'black'
            }
        };

        Plotly.newPlot('continentChart', data, layout, { 
            responsive: true,
            displayModeBar: false
        });
    }

    createTopCitiesChart() {
        const sortedData = [...this.dashboard.filteredData]
            .sort((a, b) => b.cycle + b.motorcycle - (a.cycle + a.motorcycle))
            .slice(0, 15);

        if (sortedData.length === 0) {
            document.getElementById('topCitiesChart').innerHTML = '<p class="text-center text-muted py-5">No data available for current filters</p>';
            return;
        }

        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
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
            yaxis: { 
                title: 'City', 
                automargin: true,
                tickfont: { size: 10 }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                color: isDarkMode ? 'white' : 'black'
            },
            height: 400
        };

        Plotly.newPlot('topCitiesChart', data, layout, { 
            responsive: true,
            displayModeBar: false
        });
    }

    createScatterPlot() {
        // Filter out extreme values for better visualization
        const displayData = this.dashboard.filteredData.filter(row => 
            row.motorcycle <= 100 && row.cycle <= 100
        );

        if (displayData.length === 0) {
            document.getElementById('scatterPlot').innerHTML = '<p class="text-center text-muted py-5">No data available for current filters</p>';
            return;
        }

        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        const data = [{
            type: 'scatter',
            x: displayData.map(row => row.cycle),
            y: displayData.map(row => row.motorcycle),
            mode: 'markers',
            text: displayData.map(row => row.city),
            marker: {
                size: 8,
                color: displayData.map(row => 
                    row.continent === 'Europe' ? '#4361ee' :
                    row.continent === 'Asia' ? '#f72585' :
                    row.continent === 'North America' ? '#4cc9f0' :
                    row.continent === 'South America' ? '#4895ef' :
                    row.continent === 'Africa' ? '#b5179e' : '#3a0ca3'
                ),
                opacity: 0.7
            },
            hovertemplate: '<b>%{text}</b><br>Cycling: %{x}%<br>Motorcycle: %{y}%<extra></extra>'
        }];

        const layout = {
            title: 'Cycling vs Motorcycle Correlation',
            xaxis: { 
                title: 'Cycling Percentage (%)',
                range: [0, Math.max(...displayData.map(row => row.cycle)) * 1.1]
            },
            yaxis: { 
                title: 'Motorcycle Percentage (%)',
                range: [0, Math.max(...displayData.map(row => row.motorcycle)) * 1.1]
            },
            showlegend: false,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                color: isDarkMode ? 'white' : 'black'
            }
        };

        Plotly.newPlot('scatterPlot', data, layout, { 
            responsive: true,
            displayModeBar: false
        });
    }

   createDistributionChart() {
        const cyclingData = this.dashboard.filteredData.map(row => row.cycle).filter(val => val <= 100);
        const motorcycleData = this.dashboard.filteredData.map(row => row.motorcycle).filter(val => val <= 100);

        if (cyclingData.length === 0) {
            document.getElementById('distributionChart').innerHTML = '<p class="text-center text-muted py-5">No data available for current filters</p>';
            return;
        }

        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        const data = [
            {
                x: cyclingData,
                type: 'histogram',
                name: 'Cycling Distribution',
                opacity: 0.7,
                marker: { color: '#4361ee' },
                nbinsx: 20
            },
            {
                x: motorcycleData,
                type: 'histogram',
                name: 'Motorcycle Distribution',
                opacity: 0.7,
                marker: { color: '#f72585' },
                nbinsx: 20
            }
        ];

        const layout = {
            title: 'Mode Share Distribution Analysis',
            xaxis: { title: 'Percentage (%)' },
            yaxis: { title: 'Number of Cities' },
            barmode: 'overlay',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: isDarkMode ? 'white' : 'black' },
            showlegend: true,
            legend: { x: 0.7, y: 0.9 }
        };

        Plotly.newPlot('distributionChart', data, layout, { 
            responsive: true,
            displayModeBar: true,
            displaylogo: false
        });
    }

    createClusterChart() {
        // Simple k-means clustering visualization
        const data = this.dashboard.filteredData.filter(row => 
            row.cycle <= 100 && row.motorcycle <= 100
        );

        if (data.length === 0) {
            document.getElementById('clusterChart').innerHTML = '<p class="text-center text-muted py-5">No data available for current filters</p>';
            return;
        }

        // Simple clustering algorithm (k-means with k=3)
        const clusters = this.performClustering(data, 3);
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        const trace = {
            x: data.map(row => row.cycle),
            y: data.map(row => row.motorcycle),
            mode: 'markers',
            type: 'scatter',
            text: data.map(row => row.city),
            marker: {
                size: 8,
                color: clusters,
                colorscale: 'Viridis',
                showscale: true
            },
            hovertemplate: '<b>%{text}</b><br>Cycling: %{x}%<br>Motorcycle: %{y}%<extra></extra>'
        };

        const layout = {
            title: 'City Clusters by Mode Share',
            xaxis: { title: 'Cycling Percentage (%)' },
            yaxis: { title: 'Motorcycle Percentage (%)' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: isDarkMode ? 'white' : 'black' }
        };

        Plotly.newPlot('clusterChart', [trace], layout, { 
            responsive: true,
            displayModeBar: true,
            displaylogo: false
        });
    }

    performClustering(data, k) {
        // Simple k-means implementation for demonstration
        const points = data.map(row => [row.cycle, row.motorcycle]);
        let centroids = this.initializeCentroids(points, k);
        let clusters = new Array(points.length).fill(0);
        let changed = true;

        while (changed) {
            changed = false;
            // Assign points to nearest centroid
            for (let i = 0; i < points.length; i++) {
                const distances = centroids.map(centroid => 
                    this.euclideanDistance(points[i], centroid)
                );
                const newCluster = distances.indexOf(Math.min(...distances));
                if (newCluster !== clusters[i]) {
                    clusters[i] = newCluster;
                    changed = true;
                }
            }
            // Update centroids
            centroids = this.updateCentroids(points, clusters, k);
        }

        return clusters;
    }

    initializeCentroids(points, k) {
        return points.slice(0, k);
    }

    euclideanDistance(a, b) {
        return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
    }

    updateCentroids(points, clusters, k) {
        return Array.from({length: k}, (_, cluster) => {
            const clusterPoints = points.filter((_, i) => clusters[i] === cluster);
            if (clusterPoints.length === 0) return points[0]; // Fallback
            return [
                clusterPoints.reduce((sum, p) => sum + p[0], 0) / clusterPoints.length,
                clusterPoints.reduce((sum, p) => sum + p[1], 0) / clusterPoints.length
            ];
        });
    }

    updateCharts() {
        this.createWorldMap();
        this.createContinentChart();
        this.createTopCitiesChart();
        this.createScatterPlot();
        this.createDistributionChart();
        this.createClusterChart();
    }
}
