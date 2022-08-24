import { object, string } from 'yup';

const validationSchema = () => {
  return object().shape({
    client: string().required('Client is required'),
    title: string().required('Gig Name is required'),
    startDate: string().required('Project Start Date is required'),
    wrapDate: string().required('Project End Date is required'),
    jobNumber: string().required('Gig Number is required'),
    // execProducer: string().nullable().required('Exec Producer Name is required'),
    // director: string().nullable().required('Director Name is required'),
  });
};
export default validationSchema;
