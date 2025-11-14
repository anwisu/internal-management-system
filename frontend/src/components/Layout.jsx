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
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="/"
            className="mr-4 cursor-pointer py-1.5 font-bold text-xl"
          >
            Internal Management Platform
          </Typography>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'filled' : 'text'}
                  size="sm"
                  className="hidden lg:inline-block"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </Navbar>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default Layout;

