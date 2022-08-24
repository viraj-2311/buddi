import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Success = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
  }
  
  .ant-modal-body {
    padding: 30px 55px 45px;
    position: relative;
    text-align: center;
    color: ${palette('text', 5)};
    
    .closeBtn {
      position: absolute;
      right: 30px;
      top: 30px;
    }
    .modal-icon-wrapper {
      margin-bottom: 30px;
      
      .anticon {
        font-size: 50px;
      }
    }   
    
    .title {
      font-size: 25px;
      color: ${palette('text', 5)};
      font-weight: bold;
      margin-bottom: 20px;
    }
    
    .description {
      font-size: 15px;
      color: ${palette('text', 5)};
      margin-bottom: 30px;      
    }
    
    .actions {
      button {
        width: 120px;
      }
    }
  }
`;

export default Success;
