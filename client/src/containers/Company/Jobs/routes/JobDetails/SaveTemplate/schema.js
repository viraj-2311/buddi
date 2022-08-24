import { object, string } from 'yup';

const validationSchema = object().shape({
  name: string().required('Template name is required'),
});

export default validationSchema;
