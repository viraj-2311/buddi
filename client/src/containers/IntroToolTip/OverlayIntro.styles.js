import React from 'react';
import styled from 'styled-components';

import { Modal } from 'antd';
const AntModal = (props) => (
  <Modal
    {...props}
    visible={true}
    footer={null}
    closable={false}
    maskClosable={false}
    mask={false}
    style={{
      minWidth: '100%',
      top: '0',
      padding: '0',
      marginBottom: '0',
      marginTop: '0',
      // opacity: '0.01',
    }}
  />
);

const IntroModal = styled(AntModal)`
  .ant-modal-body {
    padding: 0;
  }
`;

export default IntroModal;
