import * as Yup from "yup";

export const paymentChannelDetailsFormValidationSchema = Yup.object().shape({
  channel_id: Yup.string().required("Channel name is required"),

  method_name: Yup.string().required("Method name is required"),
});
