import {object, string, array } from 'yup';

const schema = object().shape({
  professionals: array()
    .of(
      object().shape({
        fullName: string()
          .required('Full Name is required'),
        email: string()
          .required('Email is required')
          .email('Email is not valid format'),
      })
    )
});

export default schema;
