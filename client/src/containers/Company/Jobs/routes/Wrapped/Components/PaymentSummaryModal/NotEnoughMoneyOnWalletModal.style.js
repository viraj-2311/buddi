import styled from 'styled-components';
import Modal from '@iso/components/Feedback/Modal';

const NotEnoughMoneyOnWalletModal = styled(Modal)`
  padding: 0;
  border-radius: 7px;
  
  .ant-modal-header {
    margin-top: 14px;
    text-align: center;
    border: 0;
    padding: 16px 62px;
    
    .modal-icon {
      svg {
        font-size: 50px;
      }
    }
    
    .title {
      margin-top: 19px;
      font-size: 25px;
      font-weight: bold;
      color: #2f2e50;
      line-height: 32px;
    }
  }
  
  .ant-modal-body {
    padding: 4px 53px 36px 53px;
    text-align: center;
    @media (max-width: 360px) {
      padding: 4px 25px 25px 25px;
    }
    .note {
      font-size: 15px;
      color: #2f2e50;
    }
    
    .action-buttons {
      margin-top: 25px;
      margin-bottom: 12px;
      
      .ant-btn {
        width: 251px;
        font-size: 14px;
        font-weight: bold;
      }
      
      .load-up-wallet-btn {
        margin-bottom: 20px;
      }
    }
  }
  
  .ant-modal-content {
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #f0f0f7;
    border-radius: 7px; 
  }
`

export default NotEnoughMoneyOnWalletModal;