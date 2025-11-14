import { Alert } from '@material-tailwind/react';
import { useToast } from '../../context/ToastContext';

/**
 * Toast notification component
 * Displays toast messages from ToastContext
 */
function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const colorMap = {
          success: 'green',
          error: 'red',
          warning: 'amber',
          info: 'blue',
        };

        return (
          <Alert
            key={toast.id}
            color={colorMap[toast.type] || 'blue'}
            onClose={() => removeToast(toast.id)}
            className="min-w-[300px]"
          >
            {toast.message}
          </Alert>
        );
      })}
    </div>
  );
}

export default Toast;

