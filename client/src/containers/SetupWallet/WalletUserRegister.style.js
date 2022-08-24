import styled from 'styled-components';
import { palette } from 'styled-theme';

const WalletUserRegister = styled.div`
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
    .ant-col {
      padding-right: 0 !important;
    }
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
    width: 100%;
    height: 1px;
    background-color: #e9e9f0;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .descRegister {
    color: #2f2e50;
    font-size: 15px;
    margin-top: 20px;
    margin-bottom: 15px;
    display: block;
    text-align: center;
  }
  .register-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .content {
    margin-bottom: 20px;

    .kyc-wallet {
      margin-right: 25px;
    }
    .verification-status {
      font-size: 15px;
      font-weight: bold;
      margin-top: 20px;
    }
    .border-failed {
      border: solid 1px #ff6565 !important;
    }
    .failed-status {
      margin-top: 20px;
      margin-bottom: 20px;
      border-radius: 5px;
      border: solid 1px #bcbccb;
      background-color: white;
      flex-direction: row;
      flex: 1;
      display: flex;
      padding: 10px;
      p {
        flex: 1;
        display: flex;
        align-items: center;
        color: var(--dark);
      }
      .failed {
        background-color: #ff6565;
        border-radius: 5px;
        padding: 3px 15px;
        color: #ffffff;
        font-weight: bold;
      }
    }
    .failed-container {
      background-color: #fbeded !important;
    }
    .document-require {
      margin-right: 25px;
      padding: 20px;
      border-radius: 5px;
      background-color: rgba(59, 134, 255, 0.1);
      margin-top: 20px;
      margin-bottom: 20px;
      .info-desc {
        align-content: center;
        display: flex;
        .icon-view {
          margin-top: 2px;
        }
        svg {
          margin-right: 10px;
          align-self: center;
        }
        p {
          font-size: 13px;
          font-weight: bold;
        }
        .description-warning {
          font-size: 13px;
          font-weight: normal;
        }
      }
    }
    .verification-title {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }

    .description {
      color: #2f2e50;
      font-size: 15px;
      margin-top: 20px;
      margin-bottom: 15px;
      display: block;
      text-align: center;
      color: var(--dark);
    }
    .helper-text {
      color: #ff4d4f;
    }

    .field-label {
      display: block;
      margin-bottom: 10px;
      font-size: 13px;
      color: ${palette('text', 7)};
    }
    .ssn-view {
      display: flex;
      flex: 1;
      justify-content: space-between;
      .anticon {
        margin-top: 3px;
      }
      .iconHint {
        color: ${palette('primary', 0)};
      }
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
    .buttonWrap {
      margin-top: 20px;
      min-width: 180px;
    }
  }
`;

const SSNHintTextWrapper = styled.div`
  font-size: 11px;
  max-width: 180px;
  p {
    margin-bottom: 10px;
  }
`;

export { SSNHintTextWrapper };

export default WalletUserRegister;
