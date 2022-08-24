import {object, string, array, bool } from 'yup';

const schema = object().shape({
  companyId: string().required('Production Company is required'),
  staffs: array()
    .of(
      object().shape({
        fullName: string()
          .required('Full Name is required'),
        email: string()
          .required('Email is required'),
      })
    )
});

export default schema;
