export const RadioGroupField = ({ label, name, options, register, error }) => (
  <div className='mb-4'>
    <label className='block font-medium mb-1'>{label}</label>
    {options.map((opt) => (
      <label key={opt.value} className='mr-4'>
        <input
          type='radio'
          value={opt.value}
          {...register(name)}
          className='mr-1'
        />
        {opt.label}
      </label>
    ))}
    {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
  </div>
);
