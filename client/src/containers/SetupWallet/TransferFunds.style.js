import styled from 'styled-components';

const TransferFundsWrapper = styled.div`
  .input-view {
    margin-top: 10px !important;
    display: flex;
    justify-content: center;
    align-items: center;

    .ant-input-affix-wrapper {
      box-shadow: none;
      border-color: transparent;
      height: 70px;
      padding: 0;
      width: fit-content;

      .ant-input {
        box-shadow: none;
        border-color: transparent;
        font-size: 40px;
        font-weight: bold;
        text-align: left;
      }
      .ant-input-prefix {
        font-size: 34px;
        font-weight: bold;
      }
      .anticon-close-circle {
        font-size: 20px;
      }
    }
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
  .warning {
    color: #e25656;
  }

  .content {
    margin-bottom: 20px;

    .content-text {
      text-align: center;
      font-size: 15px;
      font-weight: bold;
      color: #2f2e50;
    }

    .content-bottom-text {
      font-size: 15px;
      text-align: center;
    }

    .transfer-text {
      font-size: 15px;
      font-weight: bold;
      color: #2f2e50;
    }

    .link-bank-wallet {
      display: flex;
      justify-content: flex-start;
      padding: 20px 0 15px 0;
      align-items: start;

      .even-number,
      .small-number {
        font-size: 15px;
      }

      img {
        width: 28px;
        height: 22px;
      }

      .cover-icon {
        width: 82px;
        height: 52px;
        border-radius: 10px;
        background-color: #f5f7fa;
        justify-content: center;
        align-items: center;
        display: flex;
        border: solid 1px #f48d3a;
        img {
          width: 28px;
          height: 22px;
        }
      }

      .company-icon {
        width: 82px;
        height: 52px;
        border-radius: 7px;
        background-color: #f5f7fa;
        justify-content: center;
        align-items: center;
        display: flex;
        border: solid 1px #bcbccb;
        img {
          width: 15px;
          height: 29px;
        }
      }

      .cover-icon-purple {
        background-color: #f48d3a;
      }

      .bank-title {
        font-size: 15px;
        color: #2f2e50;
        max-width: 141px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .bank-title-small {
        font-size: 13px;
        font-weight: bold;
        color: #2f2e50;
      }
      .bank-title-view {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        white-space: normal;
      }

      .bank-title-account-number {
        margin-left: 20px;
      }
    }

    .flip-transfers-button-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .flip-transfers-button {
        img {
          width: 44px;
          margin-left: -8px;
        }
        @media only screen and (min-width: 576px) {
          margin-top: -40px;
        }
      }
    }

    .change-bank-btn {
      color: #3b86ff;
      margin-bottom: 30px;
    }
    .bank-disable {
      background-color: transparent !important;
    }
  }

  .footer {
    padding: 20px 0;

    .footer-table {
      padding: 20px;
      background-color: #f0f0f7;
      border-radius: 5px;
    }

    .footer-delimiter {
      border-bottom: solid 2px rgba(180, 180, 198, 0.5);
      margin: 20px 0;
    }

    .footer-button-container {
      text-align: center;
      margin-top: 30px;
    }

    .buttonWrap {
      font-size: 14px;
    }
    .disableButton {
      opacity: 0.5;
    }
    .footer-text-left {
      font-size: 15px;
      font-weight: bold;
      color: #2f2e50;
    }

    .footer-text {
      text-align: right;
    }

    .even-number,
    .small-number {
      font-size: 15px;
    }
  }

  .change-bank-modal {
    .ant-modal-body {
      padding: 40px 35px 57px 26px;
    }
  }
`;

export default TransferFundsWrapper;
