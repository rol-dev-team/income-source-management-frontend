import React from "react";
import Select from "react-select";

const SelectField = ({
  label,
  options,
  value,
  onChange,
  isMulti = false,
  isDisabled = false,
  placeholder = "Select...",
  ...rest
}) => {
  return (
    <div>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isDisabled={isDisabled}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default SelectField;
