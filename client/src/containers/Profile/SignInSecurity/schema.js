import { object, string, ref, bool } from 'yup';
export const SignInSecurityValidation = object().shape({
  currentPassword: string()
    .required('Current Password is required'),
  password: string().required('Password is required'),
  confirmPassword: string()
    .required('Re-Type Password is required')
    .oneOf(
      [ref('password'), null],
      'Passwords does not match'
    )
});