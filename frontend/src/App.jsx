import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Artists from './pages/Artists';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Layout from './components/Layout';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Toast from './components/common/Toast';

/**
 * Main App component with routing configuration
 * Sets up routes for Dashboard, Artists, Events, and Announcements pages
 */
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/events" element={<Events />} />
              <Route path="/announcements" element={<Announcements />} />
            </Routes>
          </Layout>
          <Toast />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

