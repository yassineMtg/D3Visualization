
import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';

function TrendPlot() {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv('/data/all_earthquakes.csv').then(setData);
  }, []);

  const trace = {
    x: data.map(d => d.time),
    y: data.map(d => +d.mag),
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'red' },
  };

  return <Plot data={[trace]} layout={{ title: 'Earthquake Magnitudes Over Time' }} />;
}

export default TrendPlot;
