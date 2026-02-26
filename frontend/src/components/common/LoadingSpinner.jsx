import React from 'react';
import { Spinner } from '@material-tailwind/react';

/**
 * Loading spinner component
 * Displays a centered loading indicator
 */
function LoadingSpinner({ size = 'lg', overlay = false }) {
  const sizeClass = size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';

  const spinnerContent = (
    <div className="flex flex-col justify-center items-center py-12 gap-4" role="status" aria-live="polite" aria-label="Loading">
      <Spinner color="indigo" className={sizeClass} aria-hidden="true" />
      <span className="text-blue-gray-500 font-medium animate-pulse">Loading...</span>
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

export default React.memo(LoadingSpinner);

