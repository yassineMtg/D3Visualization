
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';

function EarthquakeMap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv('/data/all_earthquakes.csv').then(setData);
  }, []);

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data.map((d, i) => (
        <CircleMarker key={i} center={[+d.latitude, +d.longitude]} radius={+d.mag}>
          <Tooltip>{`Mag: ${d.mag}`}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default EarthquakeMap;
