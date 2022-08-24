import React from 'react';
import styled from 'styled-components';
import MultiplyIcon from '@iso/components/icons/Multiply';

import { Modal } from 'antd';
const AntModal = (props) => (
  <Modal
    {...props}
    closeIcon={<MultiplyIcon width={16} height={16} fill='#A3A0FB' />}
    footer={null}
    maskClosable={false}
    style={{
      minWidth: '100%',
      top: '0',
      padding: '0',
      marginBottom: '0',
      marginTop: '0',
    }}
  />
);

const StyledSetupWalletModal = styled(AntModal)`
  .ant-modal-close-icon {
    font-size: 20px;
    color: #9493c0;
  }

  .ant-modal-body {
    padding: 0;
    min-height: 100vh;
    background-image: linear-gradient(#222229, #3f475b);
  }
`;

export default StyledSetupWalletModal;
