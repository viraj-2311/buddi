import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Document title is required'),
});

export default validationSchema;
