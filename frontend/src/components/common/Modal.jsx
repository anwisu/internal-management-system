import { Dialog, DialogHeader, DialogBody, DialogFooter, IconButton } from '@material-tailwind/react';
import { AiOutlineClose } from 'react-icons/ai';

/**
 * Reusable Modal component
 * Wrapper around Material Tailwind Dialog with design system
 */
function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size={sizeMap[size]}
      className="max-w-lg w-full mx-2 sm:mx-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <DialogHeader className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
        {title && (
          <h2
            id="modal-title"
            className="text-lg sm:text-xl font-medium text-gray-700"
          >
            {title}
          </h2>
        )}
        <IconButton
          variant="text"
          size="sm"
          onClick={onClose}
          className="rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close dialog"
          aria-hidden="false"
        >
          <AiOutlineClose
            className="h-5 w-5 text-gray-600"
            aria-hidden="true"
          />
        </IconButton>
      </DialogHeader>
      <DialogBody className="overflow-y-auto max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-200px)] p-4 sm:p-6">
        {children}
      </DialogBody>
      {footer && (
        <DialogFooter className="p-4 sm:p-6 border-t border-gray-200">
          {footer}
        </DialogFooter>
      )}
    </Dialog>
  );
}

export default Modal;

