import { object, string } from 'yup';

const validationSchema = object().shape({
  jobName: string().required('Gig Name is required'),
  clientDescription: string().required('Client is required'),
  paymentDue: string().required('Payment Due Date is required'),
  invoiceDate: string().required('Invoice Date is required'),
  bill_from: object().shape({
    name: string().required('Full name is required'),
    address: string().required('Address is required'),
    city: string().required('City is required'),
    state: string().required('State is required'),
    zipCode: string().required('Zip code is required'),
    email: string().required('Email is required').nullable(),
    phone: string().required('Phone is required'),
  }),
  bill_to: object().shape({
    name: string().required('Full name is required'),
    address: string().required('Address is required'),
    city: string().required('City is required'),
    state: string().required('State is required'),
    zipCode: string().required('Zip code is required'),
    email: string().required('Email is required').nullable(),
    phone: string().required('Phone is required'),
  }),
});

export default validationSchema;
