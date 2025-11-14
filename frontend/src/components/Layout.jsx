import { Navbar, Typography, Button } from '@material-tailwind/react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Layout component that provides navigation and page structure
 * Includes a navbar with links to all main sections
 */
function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/artists', label: 'Artists' },
    { path: '/events', label: 'Events' },
    { path: '/announcements', label: 'Announcements' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        className="sticky top-0 z-10 h-max max-w-full rounded-none px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-4 shadow-md bg-white"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between w-full">
          <Typography
            as="a"
            href="/"
            className="mr-2 sm:mr-4 cursor-pointer py-1.5 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="Internal Management Platform - Home"
          >
            Internal Management Platform
          </Typography>
          <nav className="flex gap-2 sm:gap-4" aria-label="Navigation menu">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
                <Button
                  variant={location.pathname === item.path ? 'filled' : 'text'}
                  size="sm"
                  className={`hidden sm:inline-block transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </Navbar>
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}

export default Layout;

