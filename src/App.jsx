
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import DatasetOverview from './pages/DatasetOverview';
import Visualization from './pages/Visualization';
import Network from './pages/Network';

function App() {
  return (
    <Router>
      <Header />
      <div style={{marginBottom: "50px"}}></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/overview" element={<DatasetOverview />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/network" element={<Network />} />
      </Routes>
    </Router>
  );
}

export default App;
