# 🌐 Data Visualization Project

An interactive data visualization web app using **React**, **D3.js**, and **Leaflet** to explore:
- 🌍 Global temperature anomalies from the Berkeley Earth dataset.
- 🔗 Network of scientific collaborations from the arXiv High Energy Physics dataset.

## 🔥 Live Demo
Access the project here: [Demo](https://visualizationapp.yassinemaatougui.tech)

---

## 📁 Datasets Used

### 1. Geospatial Dataset – Berkeley Earth
- **Type**: Spatio-temporal
- **Source**: [Berkeley Earth Archive](https://berkeleyearth.org/archive/source-files/)
- **Data**: Global temperature anomaly data (monthly) from 1850–2024

### 2. Network Dataset – arXiv High Energy Physics
- **Type**: Collaboration network (undirected)
- **Source**: [Network Repository](http://networkrepository.com/ca-HepPh.php)
- **Data**: Co-authorships between physicists from Jan 1993 to Apr 2003

---

## 🧠 Features

- 🌍 Interactive anomaly map using Leaflet
- 🎯 Filtering by year, month, and number of data points
- 🕸️ Network graph with clustering and centrality visualization
- 📊 Sample data previews and dataset analysis
- ⚡ City name lookup for points using a precomputed JSON

---

## ⚙️ Technologies

- React.js
- D3.js
- Leaflet
- Vite
- Python (for preprocessing NetCDF & city lookup)

---

## 🚀 Setup Instructions

```bash
git clone https://github.com/yassineMtg/D3Visualization.git
cd D3Visualization
npm install
npm run dev
```
