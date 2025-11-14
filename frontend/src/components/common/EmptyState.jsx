import { Button } from '@material-tailwind/react';

/**
 * Empty state component
 * Displays a message when there's no data to show
 */
function EmptyState({ message = 'No data available', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" role="status" aria-live="polite">
      <p className="text-base text-gray-700 mb-2">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button 
          size="sm" 
          onClick={onAction} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

