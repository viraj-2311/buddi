import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';

const Confirm = styled(Modal)`
  .ant-modal-body {
    text-align: center;
    color: #333333;

    .modal-icon-wrapper {
      margin-bottom: 10px;
    }

    .modal-icon {
      font-size: 60px;
      color: #eb5757;
    }
    
    .title {
      font-size: 18px;
      color: #4f4f4f;
      margin-bottom: 5px;
    }
    
    .description {
      font-size: 14px;
      margin-bottom: 25px;
      color: #bdbdbd;      
    }
    
    .actions {
      button {
        width: 120px;
        margin-right: 10px;
        font-size: 14px;
        color: #4f4f4f;
                
        &.red {
          background: #eb5757;
          color: #ffffff;
        }
      }
    }
  }
`;

export default Confirm;
