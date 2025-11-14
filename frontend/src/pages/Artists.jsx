import { Typography } from '@material-tailwind/react';

/**
 * Artists page component
 * Displays and manages artist information
 */
function Artists() {
  return (
    <div>
      <Typography variant="h2" className="mb-4">
        Artists
      </Typography>
      <Typography variant="paragraph" className="text-gray-600">
        Manage your artists here. This page will display a list of all artists
        and allow you to add, edit, or remove artist information.
      </Typography>
    </div>
  );
}

export default Artists;

