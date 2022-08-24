import { object, string } from 'yup';

export default object().shape({
  noteRequest: string().required(`Please add a note`),
});
