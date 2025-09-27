🌍 Global Cycling & Motorcycle Mode Share Dashboard
A modern, interactive dashboard for visualizing and predicting cycling and motorcycle mode share across cities worldwide. Built with HTML5, JavaScript, and Plotly.js, this dashboard offers powerful analytics and a responsive user interface.
🔗 Live Dashboard: https://kapil2020.github.io/cycling-dashboard/📂 Repository: https://github.com/kapil2020/cycling-dashboard
✨ Features

🌍 Interactive World Map: Visualize mode share data globally with Plotly.js.
📊 Diverse Charts: Includes bar, pie, scatter, histogram, and cluster analysis charts.
🌙 Light/Dark Mode: Toggle between themes for better usability.
🔍 Advanced Filtering: Filter by continent, country, data type, and mode share ranges.
📈 Predictive Analytics: Predict motorcycle share based on cycling percentage and continent.
📂 Data Export: Export filtered data as CSV.
💾 Session Management: Save and auto-restore filter settings via local storage.
📱 Responsive Design: Optimized for mobile, tablet, and desktop.
⚡ Lightweight: Pure frontend with no backend dependencies.

🚀 Getting Started
Prerequisites

A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).
A local server for development (e.g., Live Server extension in VS Code).
Node.js (optional, for local development with npm).

Installation

Clone the repository:git clone https://github.com/kapil2020/cycling-dashboard.git
cd cycling-dashboard


Install dependencies (if using a local server with npm):npm install


Serve the project locally:
Use a tool like Live Server in VS Code, or
Run npx http-server and open http://localhost:8080.



Deployment
The dashboard is designed for easy hosting on GitHub Pages.
Automatic Deployment

Fork or clone this repository.
Go to Settings → Pages in your GitHub repository.
Select GitHub Actions as the source.
Push changes to the main branch to trigger automatic deployment.
Access your site at https://<your-username>.github.io/cycling-dashboard/.

Manual Deployment

Clone the repository and make changes.
Push to your GitHub repository.
Go to Settings → Pages, select the main branch, and enable GitHub Pages.
Your site will be available at https://<your-username>.github.io/cycling-dashboard/.

🛠️ Technology Stack

Frontend: HTML5, CSS3, JavaScript (ES6+)
UI Framework: Bootstrap 5.3.0
Charts: Plotly.js 2.24.1
Range Sliders: noUiSlider 15.7.0
Icons: Font Awesome 6.4.0
Data Processing: PapaParse 5.4.1
Deployment: GitHub Pages

📊 Data Source
The dashboard uses a CSV file (data/filtered_data_2025-09-27.csv) containing cycling and motorcycle mode share data for cities worldwide. The data is sourced from a study on vehicle detection using Google Street View imagery.
CSV Format:
city,country,continent,cycle,motorcycle,type_cycle
Amsterdam,Netherlands,Europe,35.5,5.2,train
Tokyo,Japan,Asia,10.2,15.8,demo

Reference:
@misc{kyriaki2025vehicledetection,
  title = {Vehicle Detection from GSV Imagery: Predicting Travel Behaviour for Cycling and Motorcycling Using Computer Vision},
  author = {Kyriaki, Kokka and Goel, Rahul and Abbas, Ali and Nice, Kerry A. and Martial, Luca and Labib, SM and Ke, Rihuan and Schönlieb, Carola Bibiane and Woodcock, James},
  year = {2025},
  eprint = {2508.12794},
  archivePrefix = {arXiv},
  primaryClass = {cs.CV},
  url = {https://arxiv.org/abs/2508.12794}
}

📈 Usage
Filtering Data

Use the sidebar to filter by:
Cycling/Motorcycle Range: Adjust sliders to filter by percentage.
Continent/Country: Select specific regions.
Data Type: Choose between train, demo, or collated data.
Display Mode: View cycling, motorcycle, or both.


Reset filters using the "Reset Filters" button.

Predictive Analytics

Open the Predictor modal.
Select a continent and enter a cycling percentage.
Click "Calculate Prediction" to view the predicted motorcycle share and confidence score.

Data Export

Apply desired filters.
Click the "Export" button to download the filtered dataset as a CSV file.

Session Management

Click "Save Session" to store current filters in local storage.
The dashboard auto-restores the last session on load.

🐛 Troubleshooting

Charts not loading: Check the browser console (F12) for errors. Ensure data/filtered_data_2025-09-27.csv is accessible.
Data not displaying: Verify the CSV file exists and matches the expected format (see "Data Source").
Mobile layout issues: Confirm the <meta name="viewport"> tag is present in index.html.
Filters not working: Ensure noUiSlider is loaded and app.js initializes sliders correctly.

🤝 Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request with a clear description.

Guidelines:

Follow JavaScript ES6+ conventions.
Test changes locally before submitting.
Include unit tests for new features if possible.
Report bugs using the Issue Tracker.

📄 License
This project is licensed under the MIT License.
📂 Project Structure
cycling-dashboard/
├── index.html                # Main HTML file
├── css/
│   ├── style.css            # Light theme styles
│   └── dark-mode.css        # Dark theme styles
├── js/
│   ├── theme.js             # Theme toggle logic
│   ├── app.js               # Core dashboard logic
│   ├── charts.js            # Plotly chart management
│   └── advanced.js          # Predictor and comparison logic
├── data/
│   └── filtered_data_2025-09-27.csv  # Sample dataset
├── assets/
│   └── icons/               # Optional icon assets
└── README.md                # Project documentation
