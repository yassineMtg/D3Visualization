import { useEffect, useState } from 'react';
import * as d3 from 'd3';

function DatasetOverview() {
  const [geoData, setGeoData] = useState([]);
  const [networkData, setNetworkData] = useState([]);

  useEffect(() => {
    d3.csv('/data/chunks_quarters/berkeley_2024_08_to_2024_10.csv').then(sample => {
      setGeoData(sample.slice(0, 10));
    });

    d3.text('/data/ca-HepPh.txt').then(text => {
      const rows = text.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
      const edges = rows.slice(0, 10).map(row => {
        const [from, to] = row.split('\t');
        return { from, to };
      });
      setNetworkData(edges);
    });
  }, []);

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <h2>🌍 Geospatial Dataset: Berkeley Earth Surface Temperature</h2>
        <p>
          <strong>Use Case:</strong> Analyzing global warming trends (2000–2023)<br />
          <strong>Source:</strong> <a href="https://berkeleyearth.org/data/" target="_blank" rel="noreferrer">https://berkeleyearth.org/data/</a><br />
          <strong>Description (What):</strong> Global Monthly Land + Ocean Average Temperature dataset with Air Temperatures at Sea Ice, covering 1850 to recent years. Granularity: 1º x 1º Lat-Long Grid (~400 MB).<br />
        </p>

        <h4>🔹 Task 1: Identify temperature trends across continents</h4>
        <ul>
          <li><strong>Why:</strong> To understand temperature shifts over time in different global regions</li>
          <li><strong>How:</strong></li>
          <ul>
            <li>Action-Target Pair: <code>{'{Identify, Trends}'}</code></li>
            <li>Manipulations: Filter (2000–2023), Aggregate (monthly → annual), Facet (by continent)</li>
            <li>Encoding: Color gradient (blue → red), Shape = vector geographic boundaries</li>
          </ul>
        </ul>

        <h4>🔹 Task 2: Compare temperature variations between urban and rural regions</h4>
        <ul>
          <li><strong>Why:</strong> To evaluate the environmental impact of urbanization</li>
          <li><strong>How:</strong></li>
          <ul>
            <li>Action-Target Pair: <code>{'{Compare, Features}'}</code></li>
            <li>Manipulations: Partition (urban vs rural), Embed (overlay temp changes)</li>
            <li>Encoding: Size (temperature deviation), Motion (time-series animation), Facet (by decade)</li>
          </ul>
        </ul>

        <h3>📊 Sample Data (First 10 rows):</h3>
        <table border="1" cellPadding="5">
          <thead>
            <tr>{geoData.length > 0 && Object.keys(geoData[0]).map((col, i) => <th key={i}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {geoData.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <hr style={{ margin: '60px 0' }} />

        <h2>🕸️ Network Dataset: arXiv High Energy Physics Collaboration</h2>
        <p>
          <strong>Use Case:</strong> Analyzing research collaborations<br />
          <strong>Source:</strong> <a href="http://networkrepository.com/ca-HepPh.php" target="_blank" rel="noreferrer">http://networkrepository.com/ca-HepPh.php</a><br />
          <strong>Description (What):</strong> Undirected collaboration graph from arXiv papers, includes 12,008 authors and 237,010 co-authorships (Jan 1993 – Apr 2003).
        </p>

        <h4>🔹 Task 1: Discover road density variations in urban regions</h4>
        <ul>
          <li><strong>Why:</strong> Identify areas with dense collaboration networks</li>
          <li><strong>How:</strong></li>
          <ul>
            <li>Action-Target Pair: <code>{'{Discover, Distribution}'}</code></li>
            <li>Manipulations: Filter by author ID or subgraph</li>
            <li>Encoding: Node size (degree), Color (density), Layout (force-directed)</li>
          </ul>
        </ul>

        <h4>🔹 Task 2: Compare congestion patterns during peak and non-peak hours</h4>
        <ul>
          <li><strong>Why:</strong> Compare communities within the research network</li>
          <li><strong>How:</strong></li>
          <ul>
            <li>Action-Target Pair: <code>{'{Compare, Trends}'}</code></li>
            <li>Manipulations: Partition clusters, Embed collaboration flows</li>
            <li>Encoding: Node color (cluster), Shape (node links), Motion (community detection)</li>
          </ul>
        </ul>

        <h3>📊 Sample Edges (First 10 rows):</h3>
        <table border="1" cellPadding="5">
          <thead><tr><th>From</th><th>To</th></tr></thead>
          <tbody>
            {networkData.map((row, i) => (
              <tr key={i}><td>{row.from}</td><td>{row.to}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DatasetOverview;
