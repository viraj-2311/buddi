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

    .description {
      font-size: 15px;
      color: ${palette('text', 5)};
      max-width: 250px;
      margin: 0 auto 30px auto;
    }

    .actions {
      button {
        width: 160px;
        max-width: calc(50% - 20px);
        margin-right: 25px;
        font-size: 15px;
        color: #2f2e50;
        border-color: #2f2e50;

        &.red {
          background: #e25656;
          border-color: #e25656;
          color: #ffffff;
          margin-right: 0;
        }
      }
    }
  }
`;

export default Confirm;
