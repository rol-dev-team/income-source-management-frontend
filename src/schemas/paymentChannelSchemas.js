import * as Yup from "yup";

export const paymentChannelFormValidationSchema = Yup.object().shape({
  channel_name: Yup.string().required("Payment channel is required"),
});
