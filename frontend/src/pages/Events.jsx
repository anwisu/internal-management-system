import { Typography } from '@material-tailwind/react';

/**
 * Events page component
 * Displays and manages event information
 */
function Events() {
  return (
    <div>
      <Typography variant="h2" className="mb-4">
        Events
      </Typography>
      <Typography variant="paragraph" className="text-gray-600">
        Manage your events here. This page will display a list of all events
        and allow you to add, edit, or remove event information.
      </Typography>
    </div>
  );
}

export default Events;

