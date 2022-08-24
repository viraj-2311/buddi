import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  notes: Yup.string().required('Notes is required'),
});

export default validationSchema;
