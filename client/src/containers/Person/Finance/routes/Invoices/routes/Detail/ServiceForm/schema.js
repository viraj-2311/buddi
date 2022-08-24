import {object, string, array, number } from 'yup';

const schema = object().shape({
  services: array()
    .of(
      object().shape({
        title: string()
          .required('Document title is required'),
        units: number()
          .required('Units is required')
          .positive('Working Days should be greater than 0'),
        numberOfDays: number()
          .required('No. of days is required')
          .positive('No. of days should be greater than 0'),
        rate: number()
          .required('Rate is required')
          .positive('Rate should be greater than 0'),
        // totalAmount: number()
        //   .required('Total amount is required')
        //   .positive('Total amount should be greater than 0'),
      })
    )
});

export default schema;
