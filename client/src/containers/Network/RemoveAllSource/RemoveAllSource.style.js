import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const RemoveAllSourceModal = styled(Modal)`
  .ant-modal-body {
    padding: 30px 35px;

    .description {
      font-size: 15px;
      color: ${palette('text', 5)};
      margin-bottom: 30px;
      max-width: 600px;
    }

    .actions {
      justify-content: center;
      display: flex;
      margin-top: 25px;
      padding-top: 30px;
      border-top: 1px solid #ddd;

      button {
        min-width: 158px;
        font-size: 14px;
        color: ${palette('text', 5)};

        &.continueBtn {
          background: #ff6565;
          border-color: #ff6565;
          color: #ffffff;
          margin-right: 20px;
          &:hover {
            background-color: #f94d4d;
            border-color: #f94d4d;
            color: #fff;
          }
        }
      }
    }
  }
`;

export default RemoveAllSourceModal;
