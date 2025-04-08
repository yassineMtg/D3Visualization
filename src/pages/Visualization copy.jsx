import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './legend.css';
import '../App.css';

function Visualization() {
  const [startYear, setStartYear] = useState(2024);
  const [startMonth, setStartMonth] = useState(8);
  const [endYear, setEndYear] = useState(2024);
  const [endMonth, setEndMonth] = useState(10);
  const [maxRows, setMaxRows] = useState(50000); // ✅ Add user control
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationMap, setLocationMap] = useState({});

  const getStartDate = () => `${startYear}-${String(startMonth).padStart(2, '0')}-01`;
  const getEndDate = () => `${endYear}-${String(endMonth).padStart(2, '0')}-31`;

  // const getChunkFilenames = (start, end) => {
  //   const startYear = new Date(start).getFullYear();
  //   const endYear = new Date(end).getFullYear();
  //   const filenames = new Set();
  //   for (let year = startYear; year <= endYear; year++) {
  //     const offset = Math.floor((year - 1850) / 4);
  //     const chunkStart = 1850 + offset * 4;
  //     const chunkEnd = Math.min(chunkStart + 3, 2024);
  //     filenames.add(`/data/chunks/berkeley_${chunkStart}_${chunkEnd}.csv`);
  //   }
  //   return Array.from(filenames);
  // };

  const getChunkFilenames = (start, end) => {
    const filenames = new Set();
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
  
    while (current <= end) {
      let startYear = current.getFullYear();
      let startMonth = current.getMonth() + 1;
  
      let endDate = new Date(current);
      endDate.setMonth(endDate.getMonth() + 2);
      let endYear = endDate.getFullYear();
      let endMonth = endDate.getMonth() + 1;
  
      const snap = (month) => {
        if ([1, 2, 3].includes(month)) return [startYear, 2, endYear, 4];
        if ([4, 5, 6].includes(month)) return [startYear, 5, endYear, 7];
        if ([7, 8, 9].includes(month)) return [startYear, 8, endYear, 10];
        if ([10, 11, 12].includes(month)) {
          const eYear = month === 12 ? startYear + 1 : startYear;
          return [startYear, 11, eYear, 1];
        }
      };
  
      const [sy, sm, ey, em] = snap(startMonth);
      const chunkName = `/data/chunks_quarters/berkeley_${sy}_${String(sm).padStart(2, '0')}_to_${ey}_${String(em).padStart(2, '0')}.csv`;
      filenames.add(chunkName);

      current.setMonth(current.getMonth() + 3);
    }
  
    return Array.from(filenames);
  };
    
  useEffect(() => {
    fetch('/data/latlng_to_city.json')
      .then(res => res.json())
      .then(data => {
        setLocationMap(data);
      })
      .catch(err => {
        console.error("Failed to load city lookup:", err);
      });
  }, []);
  

  const getColor = (anomaly) => {
    if (anomaly >= 5) return '#ff0000';
    if (anomaly >= 3) return '#ff6600';
    if (anomaly >= 1) return '#ffcc00';
    if (anomaly >= -1) return '#cccccc';
    if (anomaly >= -2) return '#87ceeb';
    if (anomaly >= -4) return '#3399ff';
    return '#003366';
  };

  const yearOptions = Array.from({ length: 2025 - 1850 }, (_, i) => 1850 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const loadFilteredData = async () => {
    setLoading(true);
    const startDate = new Date(getStartDate());
    const endDate = new Date(getEndDate());
    const files = getChunkFilenames(startDate, endDate);
    
    console.log("Files to load:", files);
    
    const allData = [];
    let rowCount = 0;

    for (const file of files) {
      if (rowCount >= maxRows) break;
      try {
        
        console.log(`Fetching from: ${file}`);
        
        const parsed = await d3.csv(file);

        console.log(`Loaded ${parsed.length} rows from ${file}`);

        for (const d of parsed) {
          if (rowCount >= maxRows) break;
          const entry = {
            time: new Date(d.time),
            latitude: +d.latitude,
            longitude: +d.longitude,
            temperature: +d.temperature,
            climatology: +d.climatology
          };
          if (
            !isNaN(entry.latitude) &&
            !isNaN(entry.longitude) &&
            !isNaN(entry.time.getTime()) &&
            entry.time >= startDate && entry.time <= endDate
          ) {
            allData.push(entry);
            rowCount++;
          }
        }

        console.log(`Total loaded so far: ${rowCount} rows`);

      } catch (err) {
        console.error("Failed to load", file, err);
      }
    }
    console.log("Final data length:", allData.length);
    setFilteredData(allData);
    setLoading(false);
  };

  useEffect(() => {
    loadFilteredData();
  }, [startYear, startMonth, endYear, endMonth, maxRows]); // ✅ Update dependency

  const getFilteredMonthOptions = (year) => {
    if (year === 2024) return monthOptions.slice(0, 10); // Up to October
    return monthOptions;
  };  

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h2 style={{ color: 'white', textAlign: 'center' }}>🌍 Global Temperature Anomaly Map</h2>

        <div style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          color: 'white',
          paddingTop: '10px',
          width: '100%'
        }}>
          <label>Start Year:
            <select style={{marginLeft: "10px"}} value={startYear} onChange={(e) => setStartYear(+e.target.value)}>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <label>Start Month:
            <select
              style={{ marginLeft: "10px" }}
              value={startMonth}
              onChange={(e) => setStartMonth(+e.target.value)}
            >
              {getFilteredMonthOptions(startYear).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label>End Year:
            <select style={{marginLeft: "10px"}} value={endYear} onChange={(e) => setEndYear(+e.target.value)}>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <label>End Month:
            <select
              style={{ marginLeft: "10px" }}
              value={endMonth}
              onChange={(e) => setEndMonth(+e.target.value)}
            >
              {getFilteredMonthOptions(endYear).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label>Max Points:
            <input type="number" style={{marginLeft: "10px", width: "80px"}} value={maxRows} min={10000} step={10000} onChange={(e) => setMaxRows(+e.target.value)} />
          </label>
        </div>

        {loading ? <p style={{ textAlign: 'center', margin: "60px"}}>⏳ Loading data...</p> : (
          <div className="map-wrapper">
            <MapContainer center={[20, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {filteredData.map((point, idx) => (
                <CircleMarker
                  key={idx}
                  center={[point.latitude, point.longitude]}
                  radius={2.5}
                  fillColor={getColor(point.temperature)}
                  fillOpacity={0.9}
                  stroke={false}
                  zIndexOffset={1000}
                >
                  <Tooltip direction="top" offset={[0, -4]} opacity={1} permanent={false}>
                    <div>
                    <strong>
                      {locationMap[`${point.latitude},${point.longitude}`] || 'Unknown'}
                    </strong><br />
                      <strong>{point.time.toISOString().split('T')[0]}</strong><br />
                      Lat: {point.latitude.toFixed(2)}, Lon: {point.longitude.toFixed(2)}<br />
                      Anomaly: {point.temperature.toFixed(2)}°C<br />
                      Temperature: {(point.climatology + point.temperature).toFixed(2)}°C
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}

              <div className="legend">
                <h4 style={{ color: 'black' }}>Anomaly Color Scale</h4>
                <div style={{ color: 'black' }}><span style={{ background: '#ff0000' }}></span> ≥ +5°C</div>
                <div style={{ color: 'black' }}><span style={{ background: '#ff6600' }}></span> +3 to +5°C </div>
                <div style={{ color: 'black' }}><span style={{ background: '#ffcc00' }}></span> +1 to +3°C </div>
                <div style={{ color: 'black' }}><span style={{ background: '#cccccc' }}></span> -1 to +1°C </div>
                <div style={{ color: 'black' }}><span style={{ background: '#87ceeb' }}></span> -2 to -1°C </div>
                <div style={{ color: 'black' }}><span style={{ background: '#3399ff' }}></span> -4 to -2°C </div>
                <div style={{ color: 'black' }}><span style={{ background: '#003366' }}></span> ≤ -4°C </div>
              </div>
            </MapContainer>
          </div>
        )}

        <p style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>
          Showing <strong>{filteredData.length.toLocaleString()}</strong> points from <strong>{getStartDate()}</strong> to <strong>{getEndDate()}</strong>
        </p>
      </div>
    </div>
  );
}

export default Visualization;
