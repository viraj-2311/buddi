import * as Yup from 'yup';
import MemoPriceTypes from '@iso/enums/memo_price_types';

const globalSchema = {
  fullName: Yup.string().required('Name is required'),
  position: Yup.string().required('Position is required'),
  shootDates: Yup.array().min(1, 'Date is required'),
  email: Yup.string().email().required('Email is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  rates: Yup.array().of(
    Yup.object().shape(
      {
        priceType: Yup.string(),
        title: Yup.string().required('Title is Required'),

        numberOfDays: Yup.number().when('priceType', {
          is: MemoPriceTypes.HOURLY,
          then: Yup.number()
            .required('numberOfDays is required')
            .positive('numberOfDays should be greater than 0'),
        }),
        dayRate: Yup.number().when('priceType', {
          is: MemoPriceTypes.HOURLY,
          then: Yup.number()
            .required('Working Rate is required')
            .positive('Working Rate should be greater than 0'),
        }),
        projectRate: Yup.number().when('priceType', {
          is: MemoPriceTypes.FIXED,
          then: Yup.number()
            .required('Project Rate is required')
            .positive('Project Rate should greater than 0'),
        }),
      },
      ['priceType']
    )
  ),
};

const staffMemoValidationSchema = Yup.object().shape(globalSchema);

const hourlyContractorMemoValidationSchema = Yup.object().shape({
  ...globalSchema,
  // dailyHours: Yup.number()
  //   .required('Daily Hours is required')
  //   .positive('Daily Hours should be greater than 0')
  //   .max(24, 'Daily hours should be less than 24'),
  workingDays: Yup.number()
    .required('Working Days is required')
    .positive('Working Days should be greater than 0'),
  workingRate: Yup.number()
    .required('Working Rate is required')
    .positive('Working Rate should be greater than 0'),
});

const fixedContractorMemoValidationSchema = Yup.object().shape({
  ...globalSchema,
  projectRate: Yup.number()
    .required('Rate is required')
    .positive('Rate should greater than 0'),
});

export {
  staffMemoValidationSchema,
  hourlyContractorMemoValidationSchema,
  fixedContractorMemoValidationSchema,
};
