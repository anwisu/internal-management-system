import { Input, Textarea, Select, Option, Typography } from '@material-tailwind/react';

/**
 * Reusable FormField component
 * Handles input, textarea, and select with label and error message
 */
function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  options = [],
  placeholder = '',
  rows = 4,
  ...props
}) {
  const fieldId = `field-${name}`;
  const errorId = `error-${name}`;
  
  const baseProps = {
    label: label + (required ? ' *' : ''),
    name,
    id: fieldId,
    value: value || '',
    onChange,
    error: !!error,
    placeholder,
    ...props,
  };

  let FieldComponent;

  if (type === 'textarea') {
    FieldComponent = <Textarea {...baseProps} rows={rows} />;
  } else if (type === 'select') {
    FieldComponent = (
      <Select
        label={baseProps.label}
        value={value || ''}
        onChange={(val) => {
          const syntheticEvent = {
            target: { name, value: val },
          };
          onChange(syntheticEvent);
        }}
        error={baseProps.error}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  } else {
    FieldComponent = <Input {...baseProps} type={type} />;
  }

  return (
    <div className="mb-4">
      {FieldComponent}
      {error && (
        <Typography 
          variant="small" 
          id={errorId}
          className="text-red-500 text-sm mt-1"
          role="alert"
          aria-live="polite"
        >
          {error}
        </Typography>
      )}
    </div>
  );
}

export default FormField;

