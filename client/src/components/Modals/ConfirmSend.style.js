import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Confirm = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
  }

  .ant-modal-body {
    text-align: center;
    padding: 30px 60px 60px;
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
      margin-bottom: 30px;
    }

    .even-number {
      font-size: 40px;
      font-weight: 600;
      color: #2f2e50;
    }
    .small-number {
      color: #f48d3a;
      font-size: 40px;
      font-weight: 600;
    }
    .user-send {
      font-size: 15px;
      font-weight: bold;
    }

    .actions {
      button {
        width: 160px;
        font-size: 15px;
        color: #2f2e50;
        border-color: #2f2e50;
        margin-top: 20px;

        &.confirm {
          background-image: linear-gradient(to right, #6e52fc, #52a0f8);
          border-color: #ffffff;
          color: #ffffff;
          margin-right: 0;
        }
      }
    }
  }
`;

export default Confirm;
