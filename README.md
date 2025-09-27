# 🌍 Global Cycling & Motorcycle Mode Share Dashboard

A modern, interactive dashboard for visualizing and predicting cycling and motorcycle mode share across global cities using computer vision and machine learning approaches.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen) 
![Version](https://img.shields.io/badge/Version-2.0-blue) 
![License](https://img.shields.io/badge/License-MIT-green)

🔗 **Live Dashboard:** [https://kapil2020.github.io/cycling-dashboard/](https://kapil2020.github.io/cycling-dashboard/)  
📂 **Repository:** [https://github.com/kapil2020/cycling-dashboard](https://github.com/kapil2020/cycling-dashboard)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Project Structure](#️-project-structure)
- [📊 Data Source](#-data-source)
- [🛠️ Technology Stack](#️-technology-stack)
- [🎯 Advanced Features](#-advanced-features)
- [🔧 Installation & Deployment](#-installation--deployment)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎨 Visualization & UI
- **🌍 Interactive World Map** - Geographic visualization of mode share patterns
- **📊 Multi-Chart Dashboard** - Bar charts, pie charts, scatter plots, and thematic maps
- **🌙 Dark/Light Mode** - Toggle between themes for optimal viewing
- **📱 Responsive Design** - Optimized for mobile, tablet, and desktop
- **🔍 Advanced Filtering** - Filter by continent, country, city, and mode share ranges

### 📈 Analytics & Prediction
- **🤖 Predictive Analytics** - ML-based motorcycle share prediction with confidence scores
- **📈 Trend Analysis** - Visualize correlations and patterns across cities
- **📊 Statistical Insights** - Summary statistics and data distributions

### 💾 Data Management
- **📂 CSV Export** - Download filtered datasets for further analysis
- **💾 Session Management** - Save and restore filter states via local storage
- **⚡ Real-time Updates** - Instant visualization updates on filter changes

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub account (for deployment)
- Basic understanding of web technologies

### Basic Usage
1. **Access the Dashboard**: Visit the live URL or open `index.html` locally
2. **Explore Data**: Use the sidebar filters to explore different cities and regions
3. **View Visualizations**: Switch between chart types using the navigation tabs
4. **Predict Mode Share**: Use the Predictor modal for forecasting
5. **Export Data**: Download filtered results as CSV for offline analysis

---
## 🏗️ Project Structure

cycling-dashboard/
    ├── index.html # Main HTML file
    ├── css/
    │ ├── style.css # Light theme styles
    │ └── dark-mode.css # Dark theme styles
    ├── js/
    │ ├── theme.js # Theme toggle logic
    │ ├── app.js # Core dashboard logic (data load + filters)
    │ ├── charts.js # Plotly chart management (ChartManager)
    │ └── advanced.js # Predictor and comparison logic (optional)
    ├── data/
    │ └── filtered_data_2025-09-27.csv # Sample dataset
    ├── assets/
    │ └── icons/ # Optional icon assets
    └── README.md # This file
    
---
### Clone the repository
git clone https://github.com/kapil2020/cycling-dashboard.git

### Navigate to project directory
cd cycling-dashboard

### Open in browser (no build process required)
open index.html

### Or use local server for better performance
python -m http.server 8000
Then visit http://localhost:8000



---

## 📊 Data Source

### Primary Dataset
The dashboard utilizes comprehensive cycling and motorcycle mode share data collected from cities worldwide through computer vision analysis of street-level imagery from a research article which is cited in data reference.

### Research/ Data Reference
```bibtex
@misc{kyriaki2025vehicledetectiongsvimagery,
    title={Vehicle detection from GSV imagery: Predicting travel behaviour for cycling and motorcycling using Computer Vision}, 
    author={Kyriaki and Kokka and Rahul Goel and Ali Abbas and Kerry A. Nice and Luca Martial and SM Labib and Rihuan Ke and Carola Bibiane Schönlieb and James Woodcock},
    year={2025},
    eprint={2508.12794},
    archivePrefix={arXiv},
    primaryClass={cs.CV},
    url={https://arxiv.org/abs/2508.12794}
}
```


