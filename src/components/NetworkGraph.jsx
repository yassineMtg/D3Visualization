
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function NetworkGraph() {
  const svgRef = useRef();

  useEffect(() => {
    d3.text('/data/ca-HepPh.txt').then((text) => {
      const links = text.trim().split('\n').map(line => {
        const [source, target] = line.split(' ');
        return { source, target };
      });

      const nodes = Array.from(new Set(links.flatMap(l => [l.source, l.target]))).map(id => ({ id }));

      const svg = d3.select(svgRef.current)
        .attr('width', 600)
        .attr('height', 600);

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(50))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(300, 300));

      const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', '#aaa');

      const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      node.append('title').text(d => d.id);

      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });

      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

    });
  }, []);

  return <svg ref={svgRef}></svg>;
}

export default NetworkGraph;
