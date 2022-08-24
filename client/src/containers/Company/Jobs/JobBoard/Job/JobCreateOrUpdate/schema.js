import { object, string } from 'yup';

const validationSchema = () => {
  return object().shape({
    client: string().required('Band is required'),
    title: string().required('Venue is required'),
    startDate: string().required('Start date is required'),
    wrapDate: string().required('End date is required'),
    setTime: string().required('Set time is required'),
    soundCheckTime: string().required('Sound check time is required'),
    jobNumber: string().required('Gig number is required'),
    // execProducer: string().nullable().required('Exec Producer Name is required'),
    // director: string().nullable().required('Director Name is required'),
  });
};
export default validationSchema;
