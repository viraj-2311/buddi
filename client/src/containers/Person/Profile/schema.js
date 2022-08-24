import { object, string } from 'yup';
import moment from 'moment';

export default object().shape({
  firstName: string().required('First Name is required'),
  lastName: string().required('Last Name is required'),
  email: string()
    .required('Email is required')
    .email('Input correct email format'),
  phone: string().required('Phone is required'),
  city: string().required('City is required'),
  state: string().required('State is required'),
  street: string().required('Address is required'),
  birthday: string()
    .required('Date of Birth is required')
    .test('format', 'DOB should be in valid format', (value) => {
      return moment(value, 'MM/DD/YYYY', true).isValid();
    }),
  zipCode: string()
    .required('Zip Code is required')
    .test('len', 'Zip Code should be 5 or 9 digits', val => val && (val.length === 5 || val.length === 9))

});
