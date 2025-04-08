import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3';

function Network() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [linkLimit, setLinkLimit] = useState(1000); // default

  useEffect(() => {
    d3.text('/data/ca-HepPh.txt').then(text => {
      const lines = text
        .split('\n')
        .filter(line => !line.startsWith('#') && line.trim() !== '');

      const limitedLinks = lines.slice(0, linkLimit).map(line => {
        const [source, target] = line.split('\t');
        return { source, target };
      });

      const nodeSet = new Set();
      limitedLinks.forEach(link => {
        nodeSet.add(link.source);
        nodeSet.add(link.target);
      });

      const nodes = Array.from(nodeSet).map(id => ({ id }));

      setGraphData({ nodes, links: limitedLinks });
    });
  }, [linkLimit]); // reload when user changes input

  return (
    <div >
      <h2 style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
        Network (ca-HepPh)
      </h2>

      <div style={{ textAlign: 'center', marginBottom: '0px' }}>
        <label style={{ color: 'white' }}>
          Max links to load: 
          <input
            type="number"
            value={linkLimit}
            onChange={(e) => setLinkLimit(+e.target.value)}
            min={500}
            max={100000}
            step={500}
            style={{ marginLeft: '10px', padding: '5px', width: '120px' }}
          />
        </label>
      </div>

      <ForceGraph2D
        graphData={graphData}
        nodeAutoColorBy="id"
        nodeLabel="id"
        linkColor={() => '#999'}
        linkWidth={0.3}
        cooldownTicks={500}
        nodeRelSize={3}
      />
    </div>
  );
}

export default Network;
