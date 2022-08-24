import { object, string, ref } from 'yup';

const validationSchema = object().shape({
  // password: string().min(8, 'password has at least 8 characters'),
  password: string().required('Password is required'),
  email: string()
    .required('Email is required')
    .email('Email is not correct format'),
});

export default validationSchema;
