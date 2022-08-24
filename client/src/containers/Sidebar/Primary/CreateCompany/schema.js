import { object, string } from 'yup';

const validationSchemaOwner = object().shape({
  type: string().required('Band Type is required'),
  title: string().required('Band Name is required'),
  ownerEmail: string()
    .when('isOwner', {
      is: true,
      then: string().required('Band owner email is required').email('Band owner email is invalid'),
    })
});

const validationSchema = object().shape({
  type: string().required('Band Type is required'),
  title: string().required('Band Name is required'),
  ownerEmail: string()
    .when('isOwner', {
      is: false,
      then: string().required('Band owner email is required').email('Band owner email is invalid'),
    })

});

export default validationSchema;
export { validationSchemaOwner };
