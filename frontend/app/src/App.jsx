import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import DanceRoots from './DanceRoots';
import MusicalEvolution from './MusicalEvolution';
import Performance from './Performance';
import './App.css';
function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">SO CLOSE TO WHAT???</Link>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/dance-roots" className="nav-link">Dance Roots</Link></li>
            <li><Link to="/musical-evolution" className="nav-link">Musical Evolution</Link></li>
            <li><Link to="/performance" className="nav-link">Performance</Link></li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dance-roots" element={<DanceRoots />} />
        <Route path="/musical-evolution" element={<MusicalEvolution />} />
        <Route path="/performance" element={<Performance />} />
      </Routes>
    </div>
  );
}
export default App;