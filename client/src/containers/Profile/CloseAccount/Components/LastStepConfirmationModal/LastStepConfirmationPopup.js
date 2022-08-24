import React, { useState, useRef, useEffect } from 'react';
import Button from '@iso/components/uielements/button';
import MultiplyIcon from '@iso/components/icons/Multiply';
import DefaultUserIcon from '@iso/assets/images/user1.png';
import { Formik, Field, Form } from 'formik';
import { InputField } from '@iso/components';
import { useDispatch, useSelector } from 'react-redux';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';

import { LastStepConfirmationPopupContainer } from './LastStepConfirmationPopup.styles';

import {
  deleteUserAccountRequest,
  deleteUserAccountReset,
} from '@iso/redux/user/actions';
import {
  deleteCompanyAccountRequest,
  deleteCompanyAccountReset,
} from '@iso/redux/company/actions';

import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';

const LastStepConfirmationPopup = ({
  visible,
  onCancel,
  header,
  subHeader,
  data,
  params = {},
  onCancelBtnText,
  onSuccess,
  onSuccessBtnText,
  isFor,
}) => {
  const lastStepModalRef = useRef();
  const dispatch = useDispatch();
  const { syncUser } = useSelector((state) => state.Auth);
  const { deletedUserAccount } = useSelector((state) => state.User);

  const { deletedCompanyAccount } = useSelector((state) => state.Company);
  const { companyId } = useSelector((state) => state.AccountBoard);

  const [formData, setFormData] = useState({
    password: '',
  });

  const handleSubmit = async (values) => {
    let requestParams = {
      ...params,
      ...values,
    };
    if (isFor === 'company') {
      await dispatch(deleteCompanyAccountRequest(companyId, requestParams));
    } else {
      await dispatch(deleteUserAccountRequest(requestParams));
    }
  };

  useEffect(() => {
    // reset initial or destroy
    return () => {
      dispatch(deleteUserAccountReset());
      dispatch(deleteCompanyAccountReset());
    };
  }, []);

  useEffect(() => {
    if (deletedUserAccount?.status && deletedUserAccount?.status === 'ok') {
      dispatch(deleteUserAccountReset());
      onSuccess();
    } else {
      notify('error', showServerError(deletedUserAccount.error));
    }
  }, [deletedUserAccount]);

  useEffect(() => {
    if (
      deletedCompanyAccount?.status &&
      deletedCompanyAccount?.status === 'ok'
    ) {
      dispatch(syncAuthUserRequest());
    } else {
      notify('error', showServerError(deletedCompanyAccount.error));
    }
  }, [deletedCompanyAccount]);

  useEffect(() => {
    if (
      deletedCompanyAccount?.status &&
      deletedCompanyAccount?.status === 'ok' &&
      !syncUser.loading &&
      !syncUser.error
    ) {
      dispatch(deleteCompanyAccountReset());
      onSuccess();
    } else {
      notify('error', showServerError(deletedCompanyAccount.error));
    }
  }, [syncUser]);

  return (
    <LastStepConfirmationPopupContainer
      visible={visible}
      closable={false}
      onCancel={onCancel}
      wrapClassName='last-step-modal'
      footer={null}
    >
      <Formik
        enableReinitialize
        innerRef={lastStepModalRef}
        initialValues={formData}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors, setFieldValue }) => (
          <Form>
            <div className='modal-header'>
              <h5>{header}</h5>
              <Button type='link' className='closeBtn' onClick={onCancel}>
                <MultiplyIcon width={14} height={14} />
              </Button>
            </div>
            <div className='modal-body'>
              <p>{subHeader}</p>

              <div className='profile-area'>
                <div className='profile-img'>
                  <img
                    src={data?.profile || DefaultUserIcon}
                    alt='profile-image'
                  />
                </div>
                <div className='profile-inner'>
                  <h5>
                    {data?.usename}{' '}
                    {!!data?.nickname && <span>"{data?.nickname}"</span>}
                  </h5>
                  <p>{data?.position}</p>
                  <p>
                    For your security, enter your password to make this change
                  </p>
                  <div className='isoInputWrapper'>
                    <span className='field-label'>Password</span>
                    <Field
                      component={InputField}
                      name='password'
                      type='password'
                    />
                    <Button
                      className='back-btn'
                      shape='round'
                      onClick={onCancel}
                    >
                      {onCancelBtnText}
                    </Button>
                    <Button
                      className={
                        !values?.password ? 'close-btn disableBtn' : 'close-btn'
                      }
                      shape='round'
                      htmlType='submit'
                      disabled={!values?.password}
                      loading={
                        isFor === 'company'
                          ? deletedCompanyAccount?.loading
                          : deletedUserAccount?.loading
                      }
                      // onClick={onSuccess}
                    >
                      {onSuccessBtnText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </LastStepConfirmationPopupContainer>
  );
};

export default LastStepConfirmationPopup;
