import React from 'react';
import { Button } from '@material-tailwind/react';
import { FiInbox } from 'react-icons/fi';

/**
 * Empty state component
 * Displays a message when there's no data to show
 */
function EmptyState({ message = 'No data available', actionLabel, onAction, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm" role="status" aria-live="polite">
      <div className="w-16 h-16 mb-4 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 shadow-inner">
        {Icon ? <Icon className="w-8 h-8" aria-hidden="true" /> : <FiInbox className="w-8 h-8" aria-hidden="true" />}
      </div>
      <p className="text-lg font-medium text-slate-700 mb-1">
        {message}
      </p>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">
        It looks like there is nothing to display right now. Check back later or add new entries to get started.
      </p>
      {actionLabel && onAction && (
        <Button
          size="md"
          onClick={onAction}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-full hover:bg-primary-700 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 flex items-center gap-2"
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default React.memo(EmptyState);

