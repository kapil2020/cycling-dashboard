# 🌍 Global Cycling & Motorcycle Mode Share Dashboard

A modern, interactive dashboard for visualizing and predicting cycling and motorcycle mode share across global cities.  

🔗 **Live Dashboard:** [https://kapil2020.github.io/cycling-dashboard/](https://kapil2020.github.io/cycling-dashboard/)  
📂 **Repository:** [https://github.com/kapil2020/cycling-dashboard](https://github.com/kapil2020/cycling-dashboard)

---

## ✨ Features

- 🌍 Interactive world map visualization  
- 📊 Multiple chart types (bar, pie, scatter, maps)  
- 🌙 Light/Dark mode toggle  
- 🔍 Advanced filtering and search  
- 📈 Built-in predictive analytics with confidence scores  
- 📂 Export filtered results to CSV  
- 💾 Session save & auto-restore via local storage  
- 📱 Fully responsive design (mobile, tablet, desktop)  
- ⚡ Fast and lightweight (HTML5 + JS only, no backend)  

---

## 🚀 Deployment

This dashboard is designed for simple hosting on **GitHub Pages**.

### Automatic Deployment (Recommended)

1. Fork this repository  
2. Go to **Settings → Pages**  
3. Select **GitHub Actions** as source  
4. Push to `main` branch → deployment will trigger automatically  

### Manual Deployment

1. Clone the repository  
2. Push to your GitHub repository  
3. Enable **GitHub Pages** in repository settings  
4. Your site will be available at:  

🛠️ Technology Stack

Frontend: HTML5, CSS3, JavaScript (ES6+)

UI Framework: Bootstrap 5

Charts: Plotly.js

Icons: Font Awesome

Data Processing: Papa Parse

Deployment: GitHub Pages

📈 Advanced Usage
Predictive Analytics

Open the Predictor modal

Select a continent

Enter current cycling percentage

Get predicted motorcycle share with confidence score

Data Export

Apply desired filters

Click Export

Download filtered dataset as CSV

Session Management

Save Session – Preserves current filters and settings

Auto-Restore – Loads last session automatically

Local Storage – Browser stores preferences locally

🐛 Troubleshooting
Common Issues

Charts not loading → Check browser console for errors

Data not displaying → Verify CSV file path and format

Mobile layout issues → Ensure <meta name="viewport"> tag is present

Browser Compatibility

✅ Chrome 90+

✅ Firefox 88+

✅ Safari 14+

✅ Edge 90+

🤝 Contributing

Fork the project

Create a feature branch

Commit your changes

Push to the branch

Open a Pull Request

📄 License

This project is licensed under the MIT License.
See the LICENSE
 file for details.

cycling-dashboard/
├── index.html
├── css/
│   ├── style.css
│   └── dark-mode.css
├── js/
│   ├── theme.js
│   ├── app.js
│   ├── charts.js
│   └── advanced.js
├── data/
│   └── filtered_data_2025-09-27.csv
├── assets/
│   └── icons/
│   └── favicon.ico
└── README.md

---

  
---

## 📊 Data Source

The dashboard uses cycling and motorcycle mode share data from cities worldwide, including:
**Reference:**  
```bibtex
@misc{kyriaki2025vehicledetectiongsvimagery,
      title={Vehicle detection from GSV imagery: Predicting travel behaviour for cycling and motorcycling using Computer Vision}, 
      author={Kyriaki and Kokka and Rahul Goel and Ali Abbas and Kerry A. Nice and Luca Martial and SM Labib and Rihuan Ke and Carola Bibiane Schönlieb and James Woodcock},
      year={2025},
      eprint={2508.12794},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2508.12794}, 
}

