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
      className="max-w-3xl w-full mx-2 sm:mx-4 rounded-3xl bg-white backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.15)] border border-white/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <DialogHeader className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-indigo-100 rounded-t-3xl">
        {title && (
          <h2
            id="modal-title"
            className="text-lg sm:text-2xl font-semibold text-indigo-900"
          >
            {title}
          </h2>
        )}
        <IconButton
          variant="text"
          size="sm"
          onClick={onClose}
          className="rounded-full hover:bg-slate-100 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Close dialog"
          aria-hidden="false"
        >
          <AiOutlineClose
            className="h-5 w-5 text-slate-600"
            aria-hidden="true"
          />
        </IconButton>
      </DialogHeader>
      <DialogBody className="overflow-y-auto max-h-[calc(100vh-150px)] sm:max-h-[calc(100vh-240px)] p-4 sm:p-6 space-y-4">
        {children}
      </DialogBody>
      {footer && (
        <DialogFooter className="p-4 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-white to-primary-50/30 rounded-b-3xl">
          {footer}
        </DialogFooter>
      )}
    </Dialog>
  );
}

export default Modal;

