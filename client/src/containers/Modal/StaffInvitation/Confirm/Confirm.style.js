import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';

const Confirm = styled(Modal)`
  .ant-modal-body {
    text-align: center;
    color: #333333;
    
    .title {
      font-size: 18px;
      color: #333333;
      margin-bottom: 5px;
    }
    
    .description {
      font-size: 14px;
      margin-bottom: 25px;
      
      .inviteeName {
        color: #2f80ed;
      }
    }
    
    .actions {
      button {
        width: 120px;
        margin-right: 10px;
                
        &.red {
          background: #eb5757;
          color: #ffffff;
        }
        
        &.skipBtn {
          color: #eb5757; 
        }
      }
    }
  }
`;

export default Confirm;
