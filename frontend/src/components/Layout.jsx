import { useState } from 'react';
import { Navbar, Typography, Button, IconButton, Collapse, Card } from '@material-tailwind/react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiLayout, FiUser, FiCalendar } from 'react-icons/fi';
import { BsMegaphone } from "react-icons/bs";

/**
 * Layout component that provides navigation and page structure
 * Includes a navbar with links to all main sections
 */
function Layout({ children }) {
  const location = useLocation();
  const [openNav, setOpenNav] = useState(false);

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <FiLayout className="w-4 h-4" aria-hidden="true" />,
    },
    {
      path: "/artists",
      label: "Artists",
      icon: <FiUser className="w-4 h-4" aria-hidden="true" />,
    },
    {
      path: "/events",
      label: "Events",
      icon: <FiCalendar className="w-4 h-4" aria-hidden="true" />,
    },
    {
      path: "/announcements",
      label: "Announcements",
      icon: <BsMegaphone className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar 
        className="sticky top-0 z-20 h-max max-w-full bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-glass px-3 py-3 sm:px-6 lg:px-10"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-700">
              <FiLayout className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <Typography
                as="a"
                href="/"
                className="cursor-pointer text-xl sm:text-2xl font-bold text-indigo-900 leading-tight"
                aria-label="Internal Management Platform - Home"
              >
                Internal Management Platform
              </Typography>
              <p className="text-sm text-indigo-500 hidden sm:block">Curate artists, events, and announcements effortlessly</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2" aria-label="Navigation menu">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-full">
                  <Button
                    variant="text"
                    size="sm"
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      active
                        ? 'bg-primary-600 text-white shadow-soft-lg'
                        : 'text-indigo-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-inner text-sm text-indigo-600 border border-white/80">
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-indigo-900">Admin</span>
                <span className="text-xs text-indigo-500">Company Studio</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-semibold">
                IV
              </div>
            </div>
            <IconButton
              variant="text"
              className="md:hidden"
              onClick={() => setOpenNav((prev) => !prev)}
              aria-label={openNav ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={openNav}
            >
              {openNav ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          <div className="mt-4 flex flex-col gap-2 md:hidden" aria-label="Mobile navigation menu">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setOpenNav(false)}>
                  <Card className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${active ? 'border-primary-200 bg-primary-50' : 'border-white/70 bg-white/70'} shadow-glass`}>
                    <div className="flex items-center gap-3 text-indigo-700">
                      {item.icon}
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    {active && <span className="text-xs font-semibold text-primary-600">Active</span>}
                  </Card>
                </Link>
              );
            })}
          </div>
        </Collapse>
      </Navbar>
      <main className="px-3 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl mx-auto w-full flex-1">
        <div className="rounded-3xl bg-white/80 backdrop-blur-md shadow-[0_25px_60px_rgba(15,23,42,0.08)] border border-white/80 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;

