import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const MessageModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 5px;
  }

  .ant-modal-header {
    border-bottom: 1px solid #ddd;
    padding: 22px 0px 21px 35px;
  }

  .ant-modal-close {
    top: 6px;
  }

  .ant-modal-body {
    padding: 8px 26px 20px 33px;
    .content {
      h3,
      h4,
      p {
        color: #2f2e50;
      }
      .title {
        border-bottom: 1px solid rgb(188, 188, 203, 0.5);
        padding-bottom: 12px;
        display: flex;
        align-items: center;

        span.ant-tag {
          align-items: center;
          min-height: 40px;
          border-radius: 100px;
          background-color: #f0f0f7;
          display: inline-flex;
          margin: 0;
          padding-right: 20px;

          img {
            height: 30px;
            width: 30px;
            margin-right: 12px;
          }

          h4 {
            font-size: 15px;
            font-weight: normal;
            color: #2f2e50;
          }
        }
        h3 {
          font-size: 15px;
          font-weight: bold;
          color: #2f2e50;
          margin-right: 20px;
        }
      }

      .subject {
        input {
          border: none;
          background: #fff;
          border-bottom: 1px solid rgb(188, 188, 203, 0.5);
          border-radius: 0;
          padding: 0;
          height: 60px;
          color: #2f2e50;
          font-weight: bold;
          font-size: 15px;

          &:focus {
            border: none;
            border-bottom: 1px solid rgb(188, 188, 203, 0.5);
            box-shadow: none;
          }

          &::-webkit-input-placeholder {
            color: #2f2e50;
            font-weight: bold;
            font-size: 15px;
          }

          &:-ms-input-placeholder {
            color: #2f2e50;
            font-weight: bold;
            font-size: 15px;
          }

          &::placeholder {
            color: #2f2e50;
            font-weight: bold;
            font-size: 15px;
          }
        }
      }

      .message-editor {
        margin-top: 20px;
        .quill {
          background: #fafbff;

          .ql-container {
            min-height: 250px;
            border-radius: 5px 5px 0 0;
          }
          .ql-toolbar.ql-snow {
            border-radius: 0 0 5px 5px;
          }
        }
      }
      .sourceList {
        .sourceItem {
          justify-content: space-between;
          border-bottom: 1px solid rgb(188, 188, 203, 0.5);
          margin-top: 12px;
          padding-bottom: 12px;

          .ant-col {
            display: flex;
            align-items: center;
          }

          h4 {
            font-size: 15px;
            font-weight: bold;
          }
          svg {
            margin-right: 30px;
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
    }
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;

  button {
    min-width: 155px;
    margin-left: 20px;
    svg {
      color: #51369a;
    }
  }

  button.ant-btn.ant-btn-circle {
    background: #f5f7fa;
    border: none;
    min-width: 10px;
  }
`;

export default MessageModal;
