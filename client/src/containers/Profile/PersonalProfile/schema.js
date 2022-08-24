import { object, string } from 'yup';
import moment from 'moment';

export default object().shape({
  fullName: string().required('Full name is required'),
  // nickname: string().required('Nick name is required'),
  jobTitle: string().required('Gig title is required'),
  email: string()
    .required('Email is required')
    .email('Input correct email format'),
  // phone: string().required('Phone is required'),
  // birthday: string()
  //   .required('Date of Birth is required')
  //   .test('format', 'DOB should be in valid format', (value) => {
  //     return moment(value, 'MM/DD/YYYY', true).isValid();
  //   }),
});
