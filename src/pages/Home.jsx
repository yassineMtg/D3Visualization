function Home() {
  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🌐 Data Visualization Project</h1>

      <p>
        This project explores two real-world datasets using interactive and insightful visualizations:
      </p>

      <h2>1. Geospatial Dataset: Berkeley Earth (Climate)</h2>
      <p>
        An interactive map showing global temperature anomalies from 1850 to 2024 using color-coded markers. 
        Users can filter data by custom date ranges, zoom into regions, and visually analyze trends using a 
        meaningful color scale and legend.
      </p>

      <h2>2. Network Dataset: ca-HepPh (Collaboration)</h2>
      <p>
        A force-directed graph of author collaborations in high-energy physics, visualizing connections between 
        researchers based on co-authorship. Users can control the number of links loaded to balance performance 
        and insight.
      </p>

      <br></br>
      <br></br>
      <h3>Navigation Guide:</h3>
      <ul>
        <li><strong>Dataset Overview:</strong> Learn about both datasets, their tasks, and how they were visualized.</li>
        <li><strong>Visualization:</strong> Explore the interactive climate anomaly map.</li>
        <li><strong>Network:</strong> Dive into the author collaboration graph visualization.</li>
      </ul>

    </div>
  );
}

export default Home;
