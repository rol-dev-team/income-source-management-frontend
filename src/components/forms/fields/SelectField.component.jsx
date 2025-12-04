// export const SelectField = ({ label, name, register, options, error }) => (
//   <div className='mb-4'>
//     <label className='block font-medium mb-1'>{label}</label>
//     <select {...register(name)} className='border p-2 rounded w-full'>
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//     {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
//   </div>
// );

import Select from "react-select";
import { Controller } from "react-hook-form";

export const SelectField = ({
  label,
  name,
  control,
  options,
  error,
  disabled,
}) => (
  <div className='mb-4'>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          options={options}
          isClearable
          classNamePrefix='react-select'
          placeholder={`Select ${label}`}
          value={options.find((opt) => opt.value === field.value) || null}
          onChange={(selectedOption) => {
            field.onChange(selectedOption ? selectedOption.value : "");
          }}
          isDisabled={disabled}
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: "30px",
              height: "30px",
            }),
            valueContainer: (provided) => ({
              ...provided,
              height: "30px",
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              height: "30px",
            }),
            placeholder: (provided) => ({
              ...provided,
              margin: 0,
            }),
          }}
        />
      )}
    />
    {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
  </div>
);
