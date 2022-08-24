import { object, string } from 'yup';

const validationSchema = object().shape({
  headline: string().required('Headline is required'),
});

export default validationSchema;
