import { object, string } from 'yup';

const validationSchema = object().shape({
  year: string().required('Year is required').nullable(),
  month: string().required('Month is required').nullable(),
});

export default validationSchema;
