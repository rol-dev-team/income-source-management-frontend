// import { useForm } from "react-hook-form";
// import { useEffect } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { FormFieldRenderer } from "./FormFieldRenderer.component";
// import Button from "../common/Button.component";

// export const DynamicForm = ({
//   fields,
//   onSubmit,
//   validationSchema,
//   label,
//   fullWidth,
//   isLoading,
//   disabled,
//   initialData,
//   onClear,
//   onFormChange,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//     watch,
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//   });
//   const isUnitPriceChecked = watch("isUnitPrice", false);
//   useEffect(() => {
//     if (initialData) {
//       reset(initialData);
//     } else {
//       reset({});
//     }
//   }, [initialData, reset]);
//   useEffect(() => {
//     if (!onFormChange) {
//       return; // Do nothing if onFormChange prop is not provided
//     }

//     const subscription = watch((value, { name, type }) => {
//       // The watch function provides the changed field's name and its new value.
//       // We pass these up to the parent component.
//       // This allows the parent to react to specific field changes (e.g., source_id).
//       if (name) {
//         onFormChange(name, value[name]);
//       }
//     });
//     return () => subscription.unsubscribe(); // Cleanup the subscription on unmount
//   }, [watch, onFormChange]);
//   const handleFormSubmit = (data) => {
//     onSubmit(data);
//   };

//   const handleClear = () => {
//     reset({});
//     if (onClear) {
//       onClear();
//     }
//   };

//   // useEffect(() => {
//   //   const subscription = watch((value) => {
//   //     console.log("Current Form Values:", value);
//   //   });
//   //   return () => subscription.unsubscribe();
//   // }, [watch]);

//   // // Log validation errors whenever they change
//   // useEffect(() => {
//   //   if (Object.keys(errors).length > 0) {
//   //     console.log("Validation Errors:", errors);
//   //   }
//   // }, [errors]);
//   return (
//     <form
//       onSubmit={handleSubmit(handleFormSubmit)}
//       className='max-w-xl mx-auto'>
//       {fields.map((field) => (
//         <FormFieldRenderer
//           key={field.name}
//           field={field}
//           register={register}
//           control={control}
//           errors={errors}
//           isUnitPriceChecked={isUnitPriceChecked}
//         />
//       ))}
//       <div className='flex gap-2 mt-4'>
//         <Button
//           fullWidth={fullWidth}
//           children={label}
//           loading={isLoading}
//           disabled={disabled}
//           type='submit'
//         />
//         {(initialData || label === "Create") && (
//           <Button
//             fullWidth={fullWidth}
//             children='Clear'
//             onClick={handleClear}
//             disabled={isLoading}
//             type='button'
//             className='bg-gray-500 hover:bg-gray-600 text-white'
//           />
//         )}
//       </div>
//     </form>
//   );
// };
//
// import { useForm } from "react-hook-form";
// import { useEffect } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { FormFieldRenderer } from "./FormFieldRenderer.component";
// import Button from "../common/Button.component";
//
// export const DynamicForm = ({
//   fields,
//   onSubmit,
//   validationSchema,
//   label,
//   fullWidth,
//   isLoading,
//   disabled,
//   initialData,
//   onClear,
//   onFormChange,
//   onAddExpense, // New prop
//   transactionTypeId, // New prop
// }) => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//     watch,
//     getValues,
//     clearErrors,
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//   });
//   const isUnitPriceChecked = watch("isUnitPrice", false);
//
//   useEffect(() => {
//     if (initialData) {
//       reset(initialData);
//     } else {
//       reset({});
//     }
//   }, [initialData, reset]);
//
//   useEffect(() => {
//     if (!onFormChange) {
//       return;
//     }
//     const subscription = watch((value, { name, type }) => {
//       if (name) {
//         onFormChange(name, value[name]);
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [watch, onFormChange]);
//
//   const handleFormSubmit = (data) => {
//     onSubmit(data);
//   };
//
//   const handleClear = () => {
//     reset({});
//     if (onClear) {
//       onClear();
//     }
//   };
//
//   const handleAddExpenseClick = () => {
//     const currentData = getValues();
//     onAddExpense(currentData);
//   };
//
//   const isExpenseTransaction = transactionTypeId === "posting";
//   const postingDateField = fields.find(
//     (field) => field.name === "posting_date"
//   );
//
//   return (
//     <form
//       onSubmit={handleSubmit(handleFormSubmit)}
//       className={`${isExpenseTransaction? 'grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto' : 'max-w-xl mx-auto'}`}>
//       {fields.map((field) => (
//         <FormFieldRenderer
//           key={field.name}
//           field={field}
//           register={register}
//           control={control}
//           errors={errors}
//           isUnitPriceChecked={isUnitPriceChecked}
//         />
//       ))}
//
//       {isExpenseTransaction && postingDateField && (
//         <div className='flex justify-end mt-4'>
//           <Button
//             type='button' // Important: Prevents form submission
//             onClick={handleAddExpenseClick}
//             disabled={isLoading}
//             className='bg-green-500 hover:bg-green-600 text-white'>
//             Add
//           </Button>
//         </div>
//       )}
//
//       <div className='flex justify-end gap-2 mt-4'>
//         <Button
//           fullWidth={fullWidth}
//           children={label}
//           loading={isLoading}
//           disabled={disabled}
//           type='submit'
//         />
//         {(initialData || label === "Create") && (
//           <Button
//             fullWidth={fullWidth}
//             children='Clear'
//             onClick={handleClear}
//             disabled={isLoading}
//             type='button'
//             className='bg-gray-500 hover:bg-gray-600 text-white'
//           />
//         )}
//       </div>
//     </form>
//   );
// };

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormFieldRenderer } from "./FormFieldRenderer.component";
import Button from "../common/Button.component";

export const DynamicForm = ({
                              fields,
                              onSubmit,
                              validationSchema,
                              label,
                              fullWidth,
                              isLoading,
                              disabled,
                              initialData,
                              onClear,
                              onFormChange,
                              onAddExpense,
                              transactionTypeId,
                            }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    getValues,
      setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),

  });
  const isUnitPriceChecked = watch("isUnitPrice", false);
  const selectedSourceId = watch("source_id");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({});
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!onFormChange) {
      return;
    }
    const subscription = watch((value, { name, type }) => {
      if (name) {
        onFormChange(name, value[name]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

    // New useEffect to handle the "currency trading"
    useEffect(() => {
        const CURRENCY_TRADING_CATEGORY_ID = 2;

        if (selectedSourceId === CURRENCY_TRADING_CATEGORY_ID) {
            setValue("isUnitPrice", true);
        } else {
            setValue("isUnitPrice", false);
        }
    }, [selectedSourceId, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleClear = () => {
    reset({});
    if (onClear) {
      onClear();
    }
  };

  const handleAddExpenseClick = () => {
    const currentData = getValues();
    onAddExpense(currentData);
  };

  const isPostingTransaction = transactionTypeId === "posting";

  // Separate fields into different groups
  const topFields = fields.filter(
      (field) =>
          ![
            "isUnitPrice",
            "exchange_rate",
            "foreign_currency",
            "note",
          ].includes(field.name)
  );

  const bottomFields = fields.filter((field) =>
      ["isUnitPrice", "exchange_rate", "foreign_currency", "note"].includes(
          field.name
      )
  );

  return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-4xl mx-auto">
        <div className={`${isPostingTransaction? 'grid grid-cols-1 md:grid-cols-2 gap-4':''}`}>
          {topFields.map((field) => (
              <FormFieldRenderer
                  key={field.name}
                  field={field}
                  register={register}
                  control={control}
                  errors={errors}
                  isUnitPriceChecked={isUnitPriceChecked}
              />
          ))}
        </div>

        <div className="grid gap-4  mt-4">
          {bottomFields.map((field) => (
              <div
                  key={field.name}
                  className={`${field.name === "note" ? "md:col-span-12" : ""}`}
              >
                <FormFieldRenderer
                    field={field}
                    register={register}
                    control={control}
                    errors={errors}
                    isUnitPriceChecked={isUnitPriceChecked}
                />
              </div>
          ))}
        </div>

        {isPostingTransaction && (
            <div className="flex justify-end mt-4">
              <Button
                  type="button"
                  onClick={handleAddExpenseClick}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white"
              >
                Add
              </Button>
            </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button
              fullWidth={fullWidth}
              children={label}
              loading={isLoading}
              disabled={disabled}
              type="submit"
          />
          {(initialData || label === "Create") && (
              <Button
                  fullWidth={fullWidth}
                  children="Clear"
                  onClick={handleClear}
                  disabled={isLoading}
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white"
              />
          )}
        </div>
      </form>
  );
};

