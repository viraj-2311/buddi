import { object, string } from 'yup';

const bandLeaderValidationSchema = object().shape({
  // primaryInstrument: string().required('Primary Instrument is required'),
  // city: string().required('City is required'),
  // state: string().required('State is required'),
  // zipCode: string().required('Zip Code is required')
  // .test(
  //   'len',
  //   'Zip Code should be 5 or 9 digits',
  //   (val) => val && (val.length === 5 || val.length === 9)
  // ),
});

const talentValidationSchema = object().shape({
    primaryInstrument: string().required('Primary Instrument is required'),
    // union: string().required('Union number is required'),
    city: string().required('City is required'),
    state: string().required('State is required'),
    zipCode: string().required('Zip Code is required')
    .test(
      'len',
      'Zip Code should be 5 or 9 digits',
      (val) => val && (val.length === 5 || val.length === 9)
    ),
});

export { talentValidationSchema, bandLeaderValidationSchema };
