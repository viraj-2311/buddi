import { object, string, array, number } from 'yup';
import MemoPriceTypes from '@iso/enums/memo_price_types';

const schema = object().shape({
  lineItems: array().of(
    object().shape({
      title: string().required('Title is required'),
    })
  ),
});

const ratesSchema = {
  rates: array().of(
    object().shape(
      {
        priceType: string(),
        title: string().required('Title is Required'),

        numberOfDays: number().when('priceType', {
          is: MemoPriceTypes.HOURLY,
          then: number()
            .required('numberOfDays is required')
            .positive('numberOfDays should be greater than 0'),
        }),
        dayRate: number().when('priceType', {
          is: MemoPriceTypes.HOURLY,
          then: number()
            .required('Working Rate is required')
            .positive('Working Rate should be greater than 0'),
        }),
        projectRate: number().when('priceType', {
          is: MemoPriceTypes.FIXED,
          then: number()
            .required('Project Rate is required')
            .positive('Project Rate should greater than 0'),
        }),
      },
      ['priceType']
    )
  ),
};

const hourlyContractorMemoValidationSchema = object().shape({
  ...ratesSchema,
  dailyHours: number()
    .required('Daily Hours is required')
    .positive('Daily Hours should be greater than 0')
    .max(24, 'Daily hours should be less than 24'),
  workingDays: number()
    .required('Working Days is required')
    .positive('Working Days should be greater than 0'),
  workingRate: number()
    .required('Working Rate is required')
    .positive('Working Rate should be greater than 0'),
});

const fixedContractorMemoValidationSchema = object().shape({
  ...ratesSchema,
  projectRate: number()
    .required('Rate is required')
    .positive('Rate should greater than 0'),
});

export {
  hourlyContractorMemoValidationSchema,
  fixedContractorMemoValidationSchema,
};

export default schema;
