import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik, FieldArray} from 'formik';
import Select, { SelectOption } from '@iso/components/uielements/select';
import InputField from '@iso/components/shared/InputField';
import Button from '@iso/components/uielements/button';
import AwardFormWrapper from './Form.style';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';
import validationSchema from './schema';
import _ from 'lodash';

const Option = SelectOption;
const YEARS = () => {
  const currentYear = (new Date()).getFullYear();
  return _.range(currentYear, 1960, -1);
};

const AwardForm = ({visible, awards, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (awards.length) {
      setFormData({awards: awards})
    } else {
      setFormData({awards: [{title: '', year: null}]});
    }
  }, [awards]);

  useEffect(() => {
    if (!loading && !error && action === 'save') {
      setModalData('close');
      setAction('');
    }
  }, [loading, error]);

  const handleCancel = () => {
    setModalData('close');
  };

  const handleSubmit = (values) => {
    setAction('save');
    const payload = _.cloneDeep(values);
    dispatch(updateUserExpertiseRequest(authUser.id, payload));
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
        <h3 className="title">Awards</h3>
        <Button type="link" onClick={handleCancel}><MultiplyIcon width={18} height={18} fill="#eb5757" /></Button>
      </div>
      <div className="content">
        <AwardFormWrapper>
          <Formik
            enableReinitialize
            initialValues={formData}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({values, errors, touched, setFieldValue}) => (
              <Form>
                <FieldArray
                  name="awards"
                >
                  {(arrayHelpers) => (
                    <>
                      { values.awards.map((award, index) => (
                        <div className="awardFieldWrapper">
                          <div className="awardTitle">
                            <Field name={`awards[${index}].title`} type="text" component={InputField} />
                          </div>
                          <div className="awardYear">
                            <Select
                              style={{width: '100%'}}
                              value={award.year}
                              onChange={value => setFieldValue(`awards[${index}].year`, value)}
                              placeholder="Year"
                            >
                              {YEARS().map(year => (
                                <Option value={year} key={`year-${year}`}>{year}</Option>
                              ))}
                            </Select>
                          </div>
                          <Button type="link" onClick={() => arrayHelpers.remove(index)}>
                            <MultiplyIcon width={16} height={16} fill="#bdbdbd"/>
                          </Button>
                        </div>
                      ))}
                      <Button type="link" onClick={() => arrayHelpers.push({title: '', year: null})}>Add Award</Button>
                    </>
                  )}
                </FieldArray>
                <div className="actions">
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Save</Button>
                </div>
              </Form>
            )}
          </Formik>
        </AwardFormWrapper>
      </div>
    </EditStyledModal>
  );
};

AwardForm.defaultProps = {
  awards: []
};

export default AwardForm;
