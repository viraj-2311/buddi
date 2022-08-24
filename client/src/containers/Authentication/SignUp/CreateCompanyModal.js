import React, {useState} from 'react';
import {useHistory} from 'react-router';
import CreateCompanyStyledModal from './CreateCompanyModal.style';
import CreateCompanyConfirm from './CreateCompanyConfirm';
import CreateCompany from './CreateCompany';
import SignUpStyleWrapper from './SignUp.styles';

const CreateCompanyModal = ({visible, user, onCreate, onSkip, onCancel}) => {
  const [modalWidth, setModalWidth] = useState(740);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const showCreateCompany = () => {
    setModalWidth(1052);
    setIsConfirmed(true)
  };

  const skipCreateCompany = () => {
    onSkip();
  };

  const handleSuccessRegisterCompany = (company) => {
    if (onCreate) onCreate();
  };
  return (
    <CreateCompanyStyledModal
      visible={visible}
      width={modalWidth}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      {isConfirmed
        ? (
        <SignUpStyleWrapper>
          <CreateCompany user={user} onSuccess={handleSuccessRegisterCompany} />
        </SignUpStyleWrapper>
      )
      : (
        <CreateCompanyConfirm onYes={showCreateCompany} onNo={skipCreateCompany} />
      )}
    </CreateCompanyStyledModal>
  );
};

export default CreateCompanyModal;

