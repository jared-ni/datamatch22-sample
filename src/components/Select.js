import React from 'react';

// this is a wrapper around the default select to make our lives easier

const Select = ({
  className,
  disabled,
  handleInputChange,
  labels,
  name,
  placeholder,
  value,
  values,
}) => (
  <div>
    <select
      className={className}
      disabled={disabled}
      name={name}
      onChange={handleInputChange}
      value={value || ''}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {values.map((value, index) => {
        const displayLabel = labels ? labels[index] : value;
        return (
          <option key={displayLabel} value={value}>
            {displayLabel}
          </option>
        );
      })}
    </select>
  </div>
);

export default Select;
