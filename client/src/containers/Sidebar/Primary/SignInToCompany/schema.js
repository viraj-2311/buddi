import { object, string } from 'yup';

const signIntoCompanyBySelectionSchema = object().shape({
  companyId: string().required('Please select company.'),
});

const singIntoCompanyByEmailSchema = object().shape({
  ownerEmail: string()
    .required('Company owner email is required')
    .email('Company owner email is invalid'),
});

export { signIntoCompanyBySelectionSchema, singIntoCompanyByEmailSchema };
