import { object, string } from 'yup';

export default object().shape({
  title: string().required('Band Name is required'),
  address: string().required('Address is required'),
  employerNumber: string().required('Employer Number is required'),
  phone: string().required('Phone is required'),
  city: string().required('City is required'),
  state: string().required('State is required'),
  zipCode: string()
    .required('Zip Code is required')
    .test(
      'len',
      'Zip Code should be 5 or 9 digits',
      (val) => val && (val.length === 5 || val.length === 9)
    ),
  email: string().email('Email is not correct format'),
});
