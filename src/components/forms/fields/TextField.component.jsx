export const TextField = ({
  label,
  name,
  register,
  error,
  disabled,
  ...rest
}) => (
  <div className='mb-4 relative'>
    {/* {label && (
      <label
        htmlFor={name}
        className='absolute -top-3 left-2 px-1 bg-white text-gray-700 text-sm font-medium' // Adjusted for floating effect
      >
        {label}
      </label>
    )} */}
    <input
      id={name}
      {...register(name)}
      {...rest}
      className='border border-gray-300 px-2 py-1 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
      disabled={disabled}
    />
    {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
  </div>
);
