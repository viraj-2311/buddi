import styled from 'styled-components';
import { palette } from 'styled-theme';

const AddBusinessMemberWrapper = styled.div`
  .ant-modal-footer {
    border-top: 1px solid #fff;
  }
  .header {
    display: block;
    text-align: center;
    margin: 10px 0;

    .header-text {
      font-size: 20px;
      font-weight: bold;
    }
  }

  .content {
    margin: 15px;
    .ant-row {
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-bottom: 20px;
    }
    .button-add {
      min-width: 150px;
      margin-top: 20px;
      margin-left: 30px;
    }
    .ant-col {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    margin-bottom: 20px;

    .helper-text {
      color: #ff4d4f;
    }

    .field-label {
      display: block;
      margin-bottom: 10px;
      font-size: 13px;
      color: ${palette('text', 7)};
    }

    .isoForgotPass {
      font-size: 15px;
      color: ${palette('text', 8)};
    }

    .isoSignupButton {
      color: #2f80ed;
    }

    &:last-of-type {
      margin-bottom: 0;
    }

    input {
      &::-webkit-input-placeholder {
        color: ${palette('grayscale', 0)};
      }

      &:-moz-placeholder {
        color: ${palette('grayscale', 0)};
      }

      &::-moz-placeholder {
        color: ${palette('grayscale', 0)};
      }
      &:-ms-input-placeholder {
        color: ${palette('grayscale', 0)};
      }
    }
    .validate-user {
      color: #19913d;
      margin-left: 5px;
      font-size: 13px;
    }
    .ant-btn {
      align-self: center;
    }
    .button-handle-col {
      display: flex;
      justify-content: center;
      padding-top: 25px;
    }
    .handle-button {
      padding-left: 10px;
      padding-right: 10px;
      flex: 1;
    }
    .message-validate {
      display: flex;
      justify-content: center;
      text-align: center;
    }
  }
`;

export default AddBusinessMemberWrapper;
