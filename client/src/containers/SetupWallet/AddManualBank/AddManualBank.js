import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddManualBankStyle from './AddManualBank.style';
import { Row, Col } from 'antd';
import Select, { SelectOption } from '@iso/components/uielements/select';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import basicStyle from '@iso/assets/styles/constants';
import { InputField } from '@iso/components';
import schemaValidateAddManualBank from './schemaAddManualBank';
import { addManualBankCard } from '@iso/redux/wallet/actions';
import notify from '@iso/lib/helpers/notify';
import { getPlaidUserAccount } from '@iso/redux/user/actions';
import { getPlaidCompanyAccount } from '@iso/redux/company/actions';

const { rowStyle, gutter } = basicStyle;
const Option = SelectOption;
const AddManualBank = ({ companyId, onClose, visible }) => {
  const dispatch = useDispatch();
  const [bankCardNumber, setBankCardNumber] = useState('');
  const { manualBankCard } = useSelector((state) => state.Wallet);
  const formData = {
    accountType: 'SAVINGS',
    routingNumber: '',
    accountNumber: '',
    accountTypeList: [
      { name: 'Savings', type: 'SAVINGS' },
      { name: 'Checking', type: 'CHECKING' },
    ],
  };

  const handleAddingBank = (bankInfo) => {
    const payload = {
      routing_number: bankInfo.routingNumber,
      account_number: bankInfo.accountNumber,
      account_type: bankInfo.accountType,
      account_name: '',
    };
    if (companyId) {
      payload.from_company = companyId;
    }
    setBankCardNumber(bankInfo.accountNumber);
    dispatch(addManualBankCard(payload));
  };

  useEffect(() => {
    if (
      visible &&
      !manualBankCard.loading &&
      manualBankCard.success &&
      bankCardNumber.length > 4
    ) {
      if (companyId) {
        dispatch(getPlaidCompanyAccount(companyId));
      } else {
        dispatch(getPlaidUserAccount());
      }
      onClose(true, bankCardNumber);
    } else if (visible && !manualBankCard.loading && manualBankCard.error) {
      notify('error', 'Bank account can not link');
    }
  }, [manualBankCard]);

  return (
    <AddManualBankStyle>
      <div className='content'>
        <Formik
          enableReinitialize
          initialValues={formData}
          onSubmit={handleAddingBank}
          validationSchema={schemaValidateAddManualBank}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div>
                <p className='register-title'>Add your banking details</p>
              </div>
              <div className='content-view'>
                <Row style={rowStyle} gutter={gutter} justify='start'>
                  <Col md={24} sm={24} xs={24}>
                    <span className='field-label required'>Account Name</span>
                    <Field
                      component={InputField}
                      name='accountName'
                      type='text'
                    />
                  </Col>
                </Row>
                <Row style={rowStyle} gutter={gutter} justify='start'>
                  <Col md={24} sm={24} xs={24}>
                    <span className='field-label required'>Routing Number</span>
                    <Field
                      component={InputField}
                      name='routingNumber'
                      type='text'
                    />
                  </Col>
                </Row>
                <Row style={rowStyle} gutter={gutter} justify='start'>
                  <Col md={24} sm={24} xs={24}>
                    <span className='field-label required'>Account Number</span>
                    <Field
                      component={InputField}
                      name='accountNumber'
                      type='text'
                    />
                  </Col>
                </Row>
                <Row style={rowStyle} gutter={gutter} justify='start'>
                  <Col md={24} sm={24} xs={24}>
                    <span className='field-label required'>Account Type</span>
                    <Select
                      style={{ width: '100%' }}
                      name='accountType'
                      value={values.accountType}
                      onChange={(value) => setFieldValue('accountType', value)}
                    >
                      {values.accountTypeList.map((item, index) => (
                        <Option value={item.type} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>

                <Row style={rowStyle} gutter={gutter} justify='center'>
                  <Button
                    htmlType='submit'
                    type='primary'
                    shape='round'
                    className='buttonWrap'
                    loading={manualBankCard.loading}
                  >
                    Link bank account
                  </Button>
                </Row>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AddManualBankStyle>
  );
};

export default AddManualBank;
