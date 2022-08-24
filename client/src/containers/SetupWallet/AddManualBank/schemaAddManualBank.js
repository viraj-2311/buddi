import { object, string } from 'yup';

export default object().shape({
  accountNumber: string().required('Account Number is required'),
  accountName: string().required('Account Name is required'),
  routingNumber: string()
    .required('Routing Number is required')
    .test(
      'len',
      'Routing Number should be 9 characters',
      (val) => val && val.length === 9
    ),
});
