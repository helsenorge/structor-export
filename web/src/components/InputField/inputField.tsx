import React from "react";

type InputFieldProps = {
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  pattern?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
  testId?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const InputField = ({
  defaultValue,
  value,
  placeholder,
  pattern,
  maxLength,
  required,
  disabled,
  name,
  className,
  testId,
  onChange,
  onBlur,
}: InputFieldProps): React.JSX.Element => {
  return (
    <input
      data-testid={testId}
      className={className ? className : ""}
      type="text"
      autoComplete="off"
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder}
      pattern={pattern}
      maxLength={maxLength}
      required={required}
      disabled={disabled}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default InputField;
