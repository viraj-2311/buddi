import { object, string } from 'yup';
export const HelpFormValidation = object().shape({
  subject: string().required('Subject is required'),
  helpMessage: string().required('Message is required'),
});
