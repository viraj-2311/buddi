import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const GlobalModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
  }

  .ant-modal-body {
    text-align: center;
    padding: 35px 40px;
    position: relative;

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
      line-height: normal;
    }

    .description {
      font-size: 15px;
      max-width: 250px;
      color: ${palette('text', 5)};
      margin: 0 auto 30px auto;
    }

    .actions {
      margin-top:30px;
      display: flex;
      flex-direction:row;      
      justify-content: center;

      button {
        width: 200px;
        font-size: 15px;
        &:first-child:not(:last-child){
          margin-right:15px;
        }
      }
      &.column {
        flex-direction:column;
        align-items:center;
        button {
          margin-bottom: 15px;
          &:first-child{
            margin-right:0;
          }
        }
      }
    }
  }
`;

export default GlobalModal;
