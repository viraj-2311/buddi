import { object, string } from 'yup';

export default object().shape({
  notePayment: string().required(
    `Request for payment can't proceed. Please add a note`
  ),
});
