import {object, ref, string} from 'yup';

const validationSchema = object().shape({
  password: string().required('Password is required'),
  confirmPassword: string().oneOf(
    [ref('password'), null],
    'Passwords does not match'
  ),
});

export default validationSchema;
