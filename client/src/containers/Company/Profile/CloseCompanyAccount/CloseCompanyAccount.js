import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@iso/components/uielements/button';
import { CloseCompanyAccountContainer } from './CloseCompanyAccount.style';
import { Card } from 'antd';
import { useHistory } from 'react-router';

import {
  fetchCompanyWalletBalRequest,
  fetchedCompanyWalletBalReset,
} from '@iso/redux/company/actions';

import Input, { Textarea } from '@iso/components/uielements/input';
import { Formik, Field, Form } from 'formik';

import LastStepConfirmationModal from '@iso/containers/Profile/CloseAccount/Components/LastStepConfirmationModal';
import MoneyOnWalletModal from '@iso/containers/Profile/CloseAccount/Components/MoneyOnWalletModal';
import DeletedAccountPopup from './DeletedAccountPopup';
import { setWorkspaceCompany } from '@iso/redux/accountBoard/actions';

const CloseCompanyAccount = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { company: companyDetail, companyWalletBal } = useSelector(
    (state) => state.Company
  );
  const { companyId } = useSelector((state) => state.AccountBoard);

  const [isOpenMOWModal, setMOWModal] = useState(false);
  const [isOpenLSCModal, setLSCModal] = useState(false);
  const [isOpenDCAModal, setDCAModal] = useState(false);
  const formikRef = useRef();
  const [data, setData] = useState({
    reason: '',
  });

  const handleSubmit = async (data) => {
    if (data && data?.reason) {
      setData(data);
      dispatch(fetchCompanyWalletBalRequest(companyId));
    }
  };

  useEffect(() => {
    if (companyWalletBal?.status && companyWalletBal?.status !== 'ok') {
      setMOWModal(true);
    } else if (companyWalletBal?.status && companyWalletBal?.status === 'ok') {
      setLSCModal(true);
    }
  }, [companyWalletBal]);

  useEffect(() => {
    // reset initial or destroy
    return () => {
      dispatch(fetchedCompanyWalletBalReset());
    };
  }, []);

  return (
    <CloseCompanyAccountContainer>
      <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={data}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors, setFieldValue }) => (
          <Form>
            <Card className='document-card'>
              <h2 className='sectionHead'>Delete Your Band Account</h2>
              <p className='inner-title-text'>
                Are you sure you want to delete your band? This will only
                delete your band account and all the data related to this
                band account. You will still have access to your personal
                account.
              </p>
              <div className='radio-list-outer'>
                <h5>Tell us why you’re deleting your band account:</h5>
                <Textarea
                  className='note-input-box'
                  rows={5}
                  value={values?.reason}
                  onChange={(e) => setFieldValue('reason', e.target.value)}
                  name={'reason'}
                />
                <Button
                  shape='round'
                  type='primary'
                  htmlType='submit'
                  className={
                    !values?.reason ? 'next-btn disableBtn' : 'next-btn'
                  }
                  disabled={!values?.reason}
                  loading={companyWalletBal?.loading}
                >
                  Next
                </Button>
              </div>
            </Card>
          </Form>
        )}
      </Formik>
      {!!isOpenMOWModal && (
        <MoneyOnWalletModal
          visible={isOpenMOWModal}
          onCancel={() => setMOWModal(false)}
          onSuccess={() => {
            setMOWModal(false);
            history.push(`/companies/${companyId}/wallet`);
          }}
        />
      )}
      {!!isOpenLSCModal && (
        <LastStepConfirmationModal
          visible={isOpenLSCModal}
          isFor='company'
          header='Are you sure?'
          subHeader='Once you confirm, all your band account data will be permanently deleted.'
          params={data}
          data={{
            usename: companyDetail?.title,
            position: companyDetail?.type,
            profile: companyDetail?.profilePhotoS3Url,
          }}
          onCancel={() => {
            setLSCModal(false);
            setMOWModal(false);
            dispatch(fetchedCompanyWalletBalReset());
          }}
          onCancelBtnText='Back to Settings'
          onSuccess={() => {
            setLSCModal(false);
            setDCAModal(true);
            dispatch(setWorkspaceCompany(null));
          }}
          onSuccessBtnText='Delete Band'
        />
      )}
      {!!isOpenDCAModal && (
        <DeletedAccountPopup
          visible={isOpenDCAModal}
          onCancel={() => setDCAModal(false)}
        />
      )}
    </CloseCompanyAccountContainer>
  );
};

export default CloseCompanyAccount;
