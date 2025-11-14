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
  const baseProps = {
    label: label + (required ? ' *' : ''),
    name,
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
        <Typography variant="small" color="red" className="mt-1">
          {error}
        </Typography>
      )}
    </div>
  );
}

export default FormField;

