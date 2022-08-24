import React from 'react';
import Button from '@iso/components/uielements/button';
import CheckIcon from '@iso/components/icons/Check';
import ViewSuccessWrapper from './PopupRegisterSuccess.style';

const LinkBankSuccess = ({
  action,
  title,
  description,
  titleButton,
  visible,
}) => {
  return (
    <ViewSuccessWrapper
      title=''
      visible={visible}
      width={350}
      footer={null}
      closable={false}
    >
      <div>
        <Button type='success' shape='circle' size={15}>
          <CheckIcon width={25} height={25} fill={'#ffffff'} />
        </Button>
      </div>
      <div className='title'>{title}</div>
      {description != '' && <div className='description'>{description}</div>}

      <div>
        <Button
          block
          className='button'
          type='primary'
          shape='round'
          onClick={action}
        >
          {titleButton}
        </Button>
      </div>
    </ViewSuccessWrapper>
  );
};

export default LinkBankSuccess;
