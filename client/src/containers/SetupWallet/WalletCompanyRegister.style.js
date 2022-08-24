import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const WalletCompanyRegister = styled.div`
  padding: 30px;
  padding-right: 6px;

  @media only screen and (max-width: 767px) {
    margin: 10px;
  }

  @media only screen and (max-width: 375px) {
    margin: 5px;
    padding-left: 20px;

    .handle-button span {
      font-size: 10px;
    }
  }

  .business-type {
    padding: 0 15px;
    width: 100%;
    height: 50px;
    cursor: text;
    text-align: left;
    font-size: 15px;
    line-height: 1.5;
    color: #595959;
    background-color: #fafbff;
    background-image: none;
    border: 1px solid #bcbccb;
  }

  .viewButton {
    align-items: flex-flex-start;
    display: flex;
    flex-direction: column;
  }

  .ant-row {
    margin-bottom: 20px;
  }

  .border-line {
    height: 1px;
    background-color: #e9e9f0;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-right: 24px;
  }

  .descRegister {
    color: #2f2e50;
    font-size: 15px;
    margin-top: 20px;
    margin-bottom: 15px;
    display: block;
  }
  .register-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .content {
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
      margin-top: 25px;
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
    .ant-select-arrow {
      margin-right: 10px;
    }
  }
  .buttonWrap {
    margin-top: 20px;
    min-width: 180px;
  }
`;

export default WalletCompanyRegister;
