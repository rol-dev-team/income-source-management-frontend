export const TextareaField = ({ label, name, register, error }) => (
  <div className='mb-4'>
    <label className='block font-medium mb-1'>{label}</label>
    <textarea {...register(name)} className='border p-2 rounded w-full' />
    {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
  </div>
);
