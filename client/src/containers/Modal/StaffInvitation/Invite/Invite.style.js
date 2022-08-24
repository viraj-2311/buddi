import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvitationModal = styled(Modal)`
  .ant-modal-close-icon {
    font-size: 20px;
    color: #eb5757;
  }
  
  .ant-modal-body {
    padding: 36px;
    
    .title {
      font-size: 30px;
    }
    
    .subTitle {
      font-size: 14px;
      color: #828282;
    }
    
    .formWrapper {
      margin-top: 20px;
      
      .skipBtn {
        margin-left: 10px;
        color: ${palette('error', 0)};
      }
    }    
  }
`;

export default InvitationModal;
