import React, {createRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import Button from '@iso/components/uielements/button';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import validationSchema from './schema';
import ProfileTagAutocomplete from '../ProfileTagAutocomplete';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';

const tagFormattedCompanies = (companies) => {
  if (!companies) return [];
  return companies.map(company => ({id: company, name: company}));
};

const ProductionCompanyForm = ({visible, companies, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);
  const [action, setAction] = useState('');
  const companyRef = createRef();

  useEffect(() => {
    if (!loading && !error && action === 'save') {
      setModalData('close');
      setAction('');
    }
  }, [loading, error]);

  const formData = {productionCompanies: companies};

  const handleCancel = () => {
    setModalData('close');
  };

  const handleSubmit = (values) => {
    const companyInput = companyRef.current.state.query;
    if (companyInput) {
      const exists = values.productionCompanies.find(pc => pc === companyInput);
      if (!exists) {
        values.productionCompanies = [...values.productionCompanies, companyInput];
        companyRef.current.clearInput();
      }
    }
    setAction('save');
    dispatch(updateUserExpertiseRequest(authUser.id, values));
  };

  return (
    <EditStyledModal
      visible={visible}
      closable={false}
      footer={null}
      width={630}
      maskClos
      onCancel={handleCancel}
    >
      <div className="header">
        <h3 className="title">Production Companies</h3>
        <Button type="link" onClick={handleCancel}><MultiplyIcon width={18} height={18} fill="#eb5757" /></Button>
      </div>
      <div className="subtitle">Add Production Companies you have worked for in the past.</div>

      <div className="content">
        <Formik
          enableReinitialize
          initialValues={formData}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({values, errors, touched, setFieldValue}) => (
            <Form>
              <div className="formGroup">
                <label>Production Companies</label>
                <Field>
                  {() => (
                    <ProfileTagAutocomplete
                      ref={companyRef}
                      tags={tagFormattedCompanies(values.productionCompanies)}
                      placeholder="Enter Production Companies you have worked with in past"
                      onChange={(companies) => {
                        const names = companies.map(company => company.name);
                        setFieldValue('productionCompanies', names);
                      }}
                    />
                  )}
                </Field>
              </div>
              <div className="actions">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">Save</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </EditStyledModal>
  );
};

ProductionCompanyForm.defaultProps = {
  companies: {
    productionCompanies: []
  },
};

export default ProductionCompanyForm;
