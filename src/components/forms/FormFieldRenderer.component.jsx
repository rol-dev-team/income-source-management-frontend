import { TextField } from "./fields/TextField.component";
import { SelectField } from "./fields/SelectField.component";
import { CheckboxField } from "./fields/CheckboxField.component";
import { RadioGroupField } from "./fields/RadioField.component";
import { TextareaField } from "./fields/TexareaField.component";
import { DateField } from "./fields/DateField.component";

export const FormFieldRenderer = ({
  field,
  register,
  control,
  errors,
  isUnitPriceChecked,
}) => {
  const isForeignOrExchange =
    field.name === "foreign_currency" || field.name === "exchange_rate";
  // Conditionally disable the 'unit_price' field
  const isDisabled = isForeignOrExchange && !isUnitPriceChecked;

  // Conditionally disable dependent select fields
  const isSelectDisabled = field.type === "select" && field.disabled;

  // Combine props and add the disabled state
  const props = {
    ...field,
    register,
    control,
    error: errors[field.name],
    disabled: isDisabled || isSelectDisabled, // Pass disabled state to child components
  };

  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "password":
    case "tel":
    case "url":
    case "range":
    case "color":
      return <TextField {...props} type={field.type} />;
    case "select":
      return <SelectField {...props} />;
    case "checkbox":
      return <CheckboxField {...props} />;
    case "radio":
      return <RadioGroupField {...props} />;
    case "textarea":
      return <TextareaField {...props} />;
    case "date":
    case "datetime-local":
    case "month":
    case "week":
    case "time":
      return <DateField {...props} type={field.type} />;
    case "hidden":
      return <input type='hidden' name={field.name} value={field.value} />;
    default:
      return null;
  }
};
