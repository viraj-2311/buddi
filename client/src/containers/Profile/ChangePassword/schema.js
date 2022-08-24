import { object, string, ref } from 'yup';

export default object().shape({
  passwordHint: string()
    .required('Password Hint is required'),
  password: string().required('Password is required'),
  confirmPassword: string()
    .required('Re-Type Password is required')
    .oneOf(
      [ref('password'), null],
      'Passwords does not match'
    )
});
