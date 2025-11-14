import { Typography, Button } from '@material-tailwind/react';

/**
 * Empty state component
 * Displays a message when there's no data to show
 */
function EmptyState({ message = 'No data available', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Typography variant="h6" color="gray" className="mb-2">
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

