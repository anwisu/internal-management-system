import { Card as MTCard, CardHeader, CardBody, CardFooter, Typography } from '@material-tailwind/react';

/**
 * Reusable Card component
 * Wrapper around Material Tailwind Card with consistent styling
 */
function Card({ header, children, footer, className = '' }) {
  return (
    <MTCard className={`shadow-md ${className}`}>
      {header && (
        <CardHeader floated={false} shadow={false} className="rounded-none">
          {typeof header === 'string' ? (
            <Typography variant="h5" color="blue-gray">
              {header}
            </Typography>
          ) : (
            header
          )}
        </CardHeader>
      )}
      <CardBody className="p-6">{children}</CardBody>
      {footer && <CardFooter className="pt-0">{footer}</CardFooter>}
    </MTCard>
  );
}

export default Card;

