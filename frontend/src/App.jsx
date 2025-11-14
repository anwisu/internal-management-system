import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Artists from './pages/Artists';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Layout from './components/Layout';

/**
 * Main App component with routing configuration
 * Sets up routes for Dashboard, Artists, Events, and Announcements pages
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/events" element={<Events />} />
          <Route path="/announcements" element={<Announcements />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

