import styled from 'styled-components';
import Modal from '@iso/components/Feedback/Modal';

const ReadOnlyModalWrapper = styled(Modal)`
  padding: 0;
  border-radius: 7px;
  
  .ant-modal-header {
    margin-top: 21px;
    text-align: center;
    border-bottom: 0;
    border-radius: 7px 7px 0 0;
    padding: 16px 62px;
    
    .modal-icon {
      height: 50px;
      svg {
        font-size: 50px;
      }
    }
    
    .title {
      margin-top: 29px;
      font-size: 25px;
      font-weight: bold;
      color: #2f2e50;
    }
  }
  
  .ant-modal-body {
    padding: 4px 53px 54px 53px;
    text-align: center;
    .note {
      font-size: 15px;
      color: #2f2e50;
      line-height: 20px;
    }
    
    .action-buttons {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      
      .ant-btn {
        width: 140px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  
  .ant-modal-content {
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #f0f0f7;
    border-radius: 7px !important; 
  }
`

export default ReadOnlyModalWrapper;