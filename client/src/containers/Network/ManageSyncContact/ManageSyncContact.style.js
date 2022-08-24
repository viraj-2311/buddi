import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const ManageSyncContactModal = styled(Modal)`
  .ant-modal-body {
    padding: 25px 35px 30px;
    .content {
      h3,
      h4,
      p {
        color: #2f2e50;
      }
      .title {
        border-bottom: 1px solid rgb(188, 188, 203, 0.5);
        padding-bottom: 25px;
        h3 {
          font-size: 20px;
          font-weight: bold;
        }
      }
      .description {
        padding: 20px 0;
        border-bottom: 1px solid rgb(188, 188, 203, 0.5);
        p {
          font-size: 15px;
          line-height: 1.4;
          font-weight: normal;
        }
      }

      .sourceList {
        .sourceItem {
          justify-content: space-between;
          border-bottom: 1px solid rgb(188, 188, 203, 0.5);
          padding: 12px 0px;

          .ant-col {
            display: flex;
            align-items: center;
          }

          h4 {
            font-size: 15px;
            font-weight: bold;
          }
          svg {
            margin-right: 28px;
          }

          &:last-child {
            border: none;
          }

          button {
            max-height: 38px;
            min-width: 100px;
            font-size: 14px;
            color: #5c4da0;
            border-color: #5c4da0;
            background: transparent;
            &:hover,
            &:focus {
              border-color: #5c4da0;
              color: #5c4da0;
            }
          }
        }
      }
      .actions {
        justify-content: flex-end;
        display: flex;
        padding-top: 30px;
        border-top: 1px solid rgb(188, 188, 203, 0.5);

        button {
          min-width: 158px;
          font-size: 14px;
          color: ${palette('text', 5)};

          &.removeAllBtn {
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
  }
`;

export default ManageSyncContactModal;
