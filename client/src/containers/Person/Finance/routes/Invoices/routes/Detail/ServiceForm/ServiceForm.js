import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceServiceFormWrapper from './ServiceForm.style';
import { Col, Row } from 'antd';
import NumberFormat from 'react-number-format';
import { Formik, Form, Field, FieldArray, getIn } from 'formik';
import Button from '@iso/components/uielements/button';
import Input from '@iso/components/uielements/input';
import InputField from '@iso/components/shared/InputField';
import { PlusCircleOutlined } from '@ant-design/icons';
import notify from '@iso/lib/helpers/notify';
import { showServerError, formatNumberToFixed } from '@iso/lib/helpers/utility';
import {
  updateContractorInvoiceServiceRequest,
  fetchContractorInvoiceDetailRequest,
} from '@iso/redux/contractorInvoice/actions';
import schema from './schema';
import { CloseCircleFilled } from '@ant-design/icons';
import ConfirmModal from '@iso/components/Modals/Confirm';
import _ from 'lodash';

const InvoiceServiceForm = ({ invoice }) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { serviceUpdateAction } = useSelector(
    (state) => state.ContractorInvoice
  );
  const [action, setAction] = useState('');
  const [serviceDelete, setServiceDelete] = useState({
    visible: false,
    service: null,
  });
  const formData = { services: invoice.lineItems };
  const formikRef = useRef();

  const initialService = {
    title: '',
    units: 0,
    numberOfDays: 0,
    rate: 0,
    totalAmount: 0,
    notes: '',
  };

  useEffect(() => {
    if (
      !serviceUpdateAction.loading &&
      !serviceUpdateAction.error &&
      action === 'update'
    ) {
      notify('success', 'Services were updated successfully');
      dispatch(fetchContractorInvoiceDetailRequest(authUser.id, invoice.id));
      if (serviceDelete && serviceDelete.visible) {
        setServiceDelete({ visible: false, service: null });
      }
    }

    if (serviceUpdateAction.error && action === 'update') {
      notify('error', showServerError(serviceUpdateAction.error));
    }

    if (!serviceUpdateAction.loading && action === 'update') {
      setAction('');
    }
  }, [serviceUpdateAction]);

  const handleServiceSubmit = (values) => {
    setAction('update');
    let payload = _.cloneDeep({ lineItems: values.services });
    dispatch(
      updateContractorInvoiceServiceRequest(authUser.id, invoice.id, payload)
    );
  };

  const getServiceTotalAmount = (service) => {
    const { numberOfDays, units, rate } = service;
    const serviceTotalAmount = numberOfDays * units * rate;
    return formatNumberToFixed(serviceTotalAmount);
  };

  const handleRemoveService = (index, service, arrayHelpers) => {
    if (service.id) {
      setServiceDelete({ visible: true, service: service });
    } else {
      arrayHelpers.remove(index);
    }
  };
  const onServiceDeleteYes = () => {
    if (serviceDelete && serviceDelete.service) {
      const { services: lineItems } = _.cloneDeep(formikRef.current.values);
      setAction('update');
      let payload = {
        lineItems: lineItems.filter((s) => s.id !== serviceDelete.service.id),
      };
      dispatch(
        updateContractorInvoiceServiceRequest(authUser.id, invoice.id, payload)
      );
    }
  };

  const onServiceDeleteCancel = () => {
    setServiceDelete({ visible: false, service: null });
  };

  return (
    <InvoiceServiceFormWrapper>
      <ConfirmModal
        visible={serviceDelete.visible}
        description='Do you really want to delete this Service? This action cannot be undone.'
        onYes={onServiceDeleteYes}
        onNo={onServiceDeleteCancel}
      />
      <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={formData}
        validationSchema={schema}
        onSubmit={handleServiceSubmit}
      >
        {({ values, touched, errors, setFieldValue, isSubmitting }) => (
          <Form>
            <FieldArray name='services'>
              {(arrayHelpers) => (
                <>
                  {values.services.map((service, index) => (
                    <Row
                      gutter={20}
                      className='customServiceRow'
                      key={`service-${index}`}
                    >
                      <Col span={5} className='document-title'>
                        <div className='formGroup'>
                          <label className='fieldLabel'>Document Title</label>
                          <Field
                            name={`services[${index}].title`}
                            component={InputField}
                            type='text'
                          />
                        </div>
                      </Col>
                      <Col span={2} className='units'>
                        <div className='formGroup'>
                          <label className='fieldLabel'>Units</label>
                          <NumberFormat
                            name={`services[${index}].units`}
                            value={service.units || ''}
                            customInput={Input}
                            onValueChange={(values) => {
                              setFieldValue(
                                `services[${index}].units`,
                                Math.floor(values.floatValue)
                              );
                            }}
                          />
                        </div>
                      </Col>
                      <Col span={2} className='number-of-days'>
                        <div className='formGroup'>
                          <label className='fieldLabel'>No.of Days</label>
                          <NumberFormat
                            name={`services[${index}].numberOfDays`}
                            value={service.numberOfDays || ''}
                            customInput={Input}
                            onValueChange={(values) =>
                              setFieldValue(
                                `services[${index}].numberOfDays`,
                                Math.floor(values.floatValue)
                              )
                            }
                          />
                        </div>
                      </Col>
                      <Col span={3} className='rate'>
                        <div className='formGroup'>
                          <label className='fieldLabel'>Rate</label>
                          <NumberFormat
                            value={service.rate || ''}
                            thousandSeparator={true}
                            prefix='$'
                            customInput={Input}
                            onValueChange={(values) =>
                              setFieldValue(
                                `services[${index}].rate`,
                                values.floatValue
                              )
                            }
                          />
                          {getIn(touched, `services[${index}].rate`) &&
                            getIn(errors, `services[${index}].rate`) && (
                              <div className='helper-text'>
                                {errors.services[index].rate}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col span={3} className='total-amount'>
                        <div className='formGroup'>
                          <label className='fieldLabel'>Total Amount</label>
                          <NumberFormat
                            disabled
                            value={getServiceTotalAmount(service)}
                            thousandSeparator={true}
                            prefix='$'
                            customInput={Input}
                            onValueChange={(values) =>
                              setFieldValue(
                                `services[${index}].totalAmount`,
                                values.floatValue
                              )
                            }
                          />
                          {getIn(touched, `services[${index}].totalAmount`) &&
                            getIn(errors, `services[${index}].totalAmount`) && (
                              <div className='helper-text'>
                                {errors.services[index].totalAmount}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col span={8} className='notes'>
                        <div className='formGroup'>
                          <label className='fieldLabel'>Notes</label>
                          <Field
                            name={`services[${index}].notes`}
                            component={InputField}
                            type='text'
                          />
                        </div>
                      </Col>
                      <Col span={1} className='actionColumn'>
                        <label className='fieldLabel'>&nbsp;</label>
                        <Button
                          shape='circle'
                          className='closeCircle'
                          icon={<CloseCircleFilled />}
                          onClick={() =>
                            handleRemoveService(index, service, arrayHelpers)
                          }
                        />
                      </Col>
                    </Row>
                  ))}

                  <Button
                    className='addLineItemFieldBtn'
                    type='link'
                    onClick={() => arrayHelpers.push(initialService)}
                  >
                    <PlusCircleOutlined /> Add line item
                  </Button>
                </>
              )}
            </FieldArray>

            <div className='serverMessage'></div>
            {values.services.length > 0 && (
              <div className='serviceAction'>
                <Button
                  htmlType='submit'
                  className='saveBtn'
                  shape='round'
                  loading={serviceUpdateAction.loading}
                >
                  Save
                </Button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </InvoiceServiceFormWrapper>
  );
};

export default InvoiceServiceForm;
