import { object, string } from 'yup';

export default object().shape({
  email: string().required('Email is required'),
  fullName: string().required('Full Name is required'),
});
