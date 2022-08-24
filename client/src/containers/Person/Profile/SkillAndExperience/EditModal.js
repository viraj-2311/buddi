import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme'
import { Modal } from 'antd';
const AntModal = props => <Modal {...props} />;

const EditStyledModal = styled(AntModal)`
  .ant-modal-close-icon {
    font-size: 20px;
    color: #eb5757;
  } 
  
  .ant-modal-body {
    padding: 25px 65px;
    color: #4f4f4f;
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .title {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .content {
      margin-top: 20px;
    }
    
    .subtitle {
      font-size: 12px;
    }
    
    .formGroup {
      margin-bottom: 15px;
      
      .formLabel {
        display: block;
        
        &.required {
          &::after {
            content: '*';
            color: #eb5757;
          }
        }
      }
      
      .helper-text {
        color: ${palette('error', 0)};
      }
      
      .muted {
        font-size: 10px;
        color: #828282;
        
        &.align-right {
          text-align: right;
        }
      }
    }
    
    .actions {
      text-align: right; 
      
      button {
        margin-left: 10px;
      }
    }
  }
`;

export default EditStyledModal;