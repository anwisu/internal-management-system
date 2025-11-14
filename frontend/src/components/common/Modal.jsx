import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';

/**
 * Reusable Modal component
 * Wrapper around Material Tailwind Dialog
 */
function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  };

  return (
    <Dialog open={open} handler={onClose} size={sizeMap[size]}>
      {title && <DialogHeader>{title}</DialogHeader>}
      <DialogBody>{children}</DialogBody>
      {footer && <DialogFooter>{footer}</DialogFooter>}
    </Dialog>
  );
}

export default Modal;

