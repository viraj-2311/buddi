import {object, string} from 'yup';

const validationSchema = object().shape({
  university: string().required('School/University is required'),
  degree: string().required('Degree is require'),
  studyField: string().required('Study Field is require'),
  startYear: string().required('Start Year is required').nullable(),
  endYear: string().required('End Year is required').nullable(),
});

export default validationSchema;
