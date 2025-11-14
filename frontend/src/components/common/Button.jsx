import { Button as MTButton } from '@material-tailwind/react';

/**
 * Reusable Button component with loading state
 * Wrapper around Material Tailwind Button
 */
function Button({ loading = false, children, disabled, ...props }) {
  return (
    <MTButton disabled={disabled || loading} {...props}>
      {loading ? 'Loading...' : children}
    </MTButton>
  );
}

export default Button;

