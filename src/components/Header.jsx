import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <nav className="fixed-header">
      <ul>
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/overview" className={location.pathname === '/overview' ? 'active' : ''}>Datasets Overview</Link>
        </li>
        <li>
          <Link to="/visualization" className={location.pathname === '/visualization' ? 'active' : ''}>Geospatial Visualization</Link>
        </li>
        <li>
          <Link to="/network" className={location.pathname === '/network' ? 'active' : ''}>Network Visualization</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;