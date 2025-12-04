export const CheckboxField = ({ label, name, register, error }) => (
  <div className='mb-4 flex items-center'>
    <input type='checkbox' id={name} {...register(name)} className='mr-2' />
    <label htmlFor={name} className='cursor-pointer'>
      {label}
    </label>
    {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
  </div>
);
