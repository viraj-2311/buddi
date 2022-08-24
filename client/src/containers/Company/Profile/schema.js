import { object, string, number } from 'yup';

export default object().shape({
  title: string().required('Band Name is required'),
  ownerEmail: string()
    // .required('Email is required')
    .email('Input correct email format'),
  // ein: number().required('EIN number is required'),
  // address: string().required('Address is required'),
  // city: string().required('City is required'),
  // state: string().required('State is required'),
  // zipCode: string()
  //   .required('Zip Code is required')
  //   .test('len', 'Zip Code should be 5 or 9 digits', val => val && (val.length === 5 || val.length === 9)),
});
