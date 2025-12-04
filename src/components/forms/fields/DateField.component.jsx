export const DateField = ({ label, name, register, error }) => (
  <div className='mb-4'>
    {/*<label className='block font-medium mb-1'>{label}</label>*/}
    <input
      type='date'
      {...register(name)}
      className='border border-gray-300 px-2 py-1 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
    />
    {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
  </div>
);
