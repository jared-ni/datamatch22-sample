import React from 'react';

// renders a textarea (long form textbox), wraps a default textarea to simplify what we want

const Textarea = ({
  className,
  disabled,
  handleInputChange,
  name,
  placeholder,
  rows,
  type,
  value,
}) => (
  <div>
    <textarea
      className={className}
      disabled={disabled}
      maxLength={300}
      name={name}
      onChange={handleInputChange}
      placeholder={placeholder || name}
      rows={rows}
      type={type}
      value={value}
    />
  </div>
);

export default Textarea;
