import { object, string } from 'yup';

const validationSchema = object().shape({
  email: string()
    .required('Email is required')
    .email('Email is not correct format'),
});

export default validationSchema;
