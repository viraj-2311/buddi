import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const RemoveConnectionModal = styled(Modal)`
  .ant-modal-body {
    padding: 30px;

    .description {
      font-size: 15px;
      color: ${palette('text', 5)};
      margin-bottom: 30px;
      max-width: 600px;
    }

    .actions {
      justify-content: flex-end;
      display: flex;
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #ddd;

      button {
        width: 160px;
        margin-right: 20px;
        font-size: 14px;
        color: ${palette('text', 5)};

        &.red {
          background: #ff6565;
          border-color: #ff6565;
          color: #ffffff;
          margin-right: 0;
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

export default RemoveConnectionModal;
