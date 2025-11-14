import { Typography } from '@material-tailwind/react';

/**
 * Announcements page component
 * Displays and manages company announcements
 */
function Announcements() {
  return (
    <div>
      <Typography variant="h2" className="mb-4">
        Announcements
      </Typography>
      <Typography variant="paragraph" className="text-gray-600">
        Manage your announcements here. This page will display a list of all
        announcements and allow you to add, edit, or remove announcement
        information.
      </Typography>
    </div>
  );
}

export default Announcements;

