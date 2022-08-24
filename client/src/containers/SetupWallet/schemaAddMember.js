import { object, string } from 'yup';

const validationSchema = object().shape({
  fullName: string().required('Fullname is required'),
  positionTitle: string().required('Position is required'),
  email: string()
    .required('Email is required')
    .email('Email is not correct format'),
});

export default validationSchema;
