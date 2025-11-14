import { Spinner } from '@material-tailwind/react';

/**
 * Loading spinner component
 * Displays a centered loading indicator
 */
function LoadingSpinner({ size = 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
  return (
    <div className="flex justify-center items-center py-12">
      <Spinner color="blue" className={sizeClass} />
    </div>
  );
}

export default LoadingSpinner;

