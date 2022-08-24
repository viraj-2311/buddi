import React, { useState } from 'react';
import Button from '@iso/components/uielements/button';
import MultiplyIcon from '@iso/components/icons/Multiply';
import WarningIC from '@iso/assets/images/warning.webp';
import { useDispatch } from 'react-redux';

import { DeletedAccountPopupContainer } from './DeletedAccountPopup.styles';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';

import CreateCompanyModal from '../../../../Sidebar/Primary/CreateCompany';
import { useHistory } from 'react-router';

const DeletedAccountPopup = ({ visible, onCancel }) => {
  const history = useHistory();

  const [visibleCreateCompanyModal, setVisibleCreateCompanyModal] =
    useState(false);
  const dispatch = useDispatch();

  const handleExit = () => {
    onCancel();
    history.push('/jobs');
    dispatch(syncAuthUserRequest());
  };

  const handleCompanyCreate = (type) => {
    dispatch(syncAuthUserRequest());
    if (type === 'close') {
      onCancel();
      setVisibleCreateCompanyModal(false);
      history.push('/jobs');
    }

    if (type === 'success') {
      onCancel();
      setVisibleCreateCompanyModal(false);
      history.push('/jobs');
    }
  };

  return (
    <DeletedAccountPopupContainer
      visible={visible}
      closable={false}
      // onCancel={onCancel}
      wrapClassName='c-a-d-popup'
      footer={null}
    >
      <div className='modal-header'>
        <Button
          type='link'
          className='closeBtn'
          onClick={() => {
            onCancel();
            dispatch(syncAuthUserRequest());
            history.push('/jobs');
          }}
        >
          <MultiplyIcon width={14} height={14} />
        </Button>
      </div>
      <div className='modal-inner'>
        <img src={WarningIC} alt='warning-logo' />
        <h5>Bandleader Deleted</h5>

        <Button
          shape='round'
          type='primary'
          htmlType='submit'
          className='exit-btn'
          onClick={handleExit}
        >
          Exit
        </Button>

        <Button
          shape='round'
          type='primary'
          htmlType='submit'
          className='next-btn'
          onClick={() => setVisibleCreateCompanyModal(true)}
        >
          Create New Company
        </Button>
      </div>
      <CreateCompanyModal
        visible={visibleCreateCompanyModal}
        setModalData={handleCompanyCreate}
      />
    </DeletedAccountPopupContainer>
  );
};

export default DeletedAccountPopup;
