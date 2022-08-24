import React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
const AntModal = props => <Modal {...props} />;

const CreateCompanyStyledModal = styled(AntModal)`
  transition: all 0.2s ease-in-out;
  
  .ant-modal-close-icon {
    font-size: 20px;
    color: #eb5757;
  } 
  
  .ant-modal-body {
    padding: 0;
  }
`;

export default CreateCompanyStyledModal;