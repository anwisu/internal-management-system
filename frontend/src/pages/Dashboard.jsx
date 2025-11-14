import { Typography } from '@material-tailwind/react';

/**
 * Dashboard page component
 * Main landing page for the internal management platform
 */
function Dashboard() {
  return (
    <div>
      <Typography variant="h2" className="mb-4">
        Dashboard
      </Typography>
      <Typography variant="paragraph" className="text-gray-600">
        Welcome to the Internal Management Platform. This is your central hub
        for managing artists, events, schedules, and announcements.
      </Typography>
    </div>
  );
}

export default Dashboard;

