import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Receipt title is required'),
  paymentDue: Yup.string().required('Payment due is required'),
  amount: Yup.number()
    .required('Payment due is required')
    .positive('Payment due should be greater than 0'),

});

export default validationSchema;
