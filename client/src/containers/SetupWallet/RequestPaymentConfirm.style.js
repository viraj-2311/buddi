import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const PopupModal = styled(Modal)`
  min-width: 320px;
  padding: 20px;
  @media only screen and (max-width: 425px) {
    .ant-modal-content {
      margin: 10px;
    }
  }

  .viewButton {
    align-items: flex-end;
    display: flex;
  }
  .ant-modal-footer {
    width: 92%;
    margin: auto;
    padding: 10px 0;
  }

  .ant-modal-body {
    padding: 0 35px 20px;

    .content {
      .ant-row {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .ant-col {
        padding: 0 !important;
      }

      .field-label {
        display: block;
        margin-bottom: 10px;
        margin-top: 10px;
        font-size: 13px;
        color: ${palette('text', 7)};
      }
      .total-request {
        font-size: 13px;
        color: var(--dark);
        text-align: right;
        margin-top: 5px;
        align-content: center;

        span {
          margin-left: 8px;
        }
      }
      .detail-contact {
        display: flex;
        align-items: center;
        padding: 20px;
        padding-top: 15px;
        padding-bottom: 15px;
        border-radius: 10px;
        background-color: #f0f0f7;
        flex-wrap: wrap;
      }
      .user-name {
        display: flex;
        align-items: center;
        flex: 1;
        margin-right: 20px;
        margin-top: 10px;
        margin-bottom: 10px;

        p {
          font-size: 20px;
          font-weight: normal;
          text-align: left;
          color: var(--dark);
        }
      }
      .right-user-view {
        display: flex;
        justify-content: center;
      }
      .avatar-icon {
        border-radius: 27px;
        margin-right: 20px;

        img {
          width: 54px;
          height: 54px;
        }
      }
      .remove-user {
        margin-left: 25px;
        display: flex;
        align-items: center;
      }
      .user-cell {
        margin-bottom: 30px;
      }
      .total-amount {
        text-align: right;
        font-weight: bold;
        .currency {
        }
        .even-number {
          color: #2f2e50;
        }

        .small-number {
          color: #808bff;
        }

        span {
          font-size: 25px;
          color: #2f2e50;
        }
      }
      .note-title {
        font-size: 15px;
        font-weight: bold;
        color: #2f2e50;
        margin-right: 5px;
      }
    }

    h3 {
      font-size: 15px;
      font-weight: bold;
      color: #2f2e50;
    }
  }

  .actions {
    button {
      width: 160px;
      margin-right: 20px;
      font-size: 14px;
      color: ${palette('text', 5)};
    }
  }

  .actionContinue {
    button {
      width: 100px;
      margin-right: 20px;
      font-size: 14px;
      color: ${palette('text', 5)};
    }
  }

  .border-line {
    width: 100%;
    height: 1px;
    opacity: 0.5;
    background-color: #b4b4c6;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .vertical-view {
    display: flex;
    justify-content: center;
  }
  .input-amount {
    margin-left: 30px;
    margin-right: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .input-view {
    margin-top: 20px !important;
    .ant-input-affix-wrapper {
      box-shadow: none;
      border-color: transparent;
      height: 70px;
      padding: 0;

      .ant-input {
        box-shadow: none;
        border-color: transparent;
        font-size: 40px;
        font-weight: bold;
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
  .note-view {
    .lowercase {
      margin-top: 5px;
    }
  }
  .ant-radio-group {
    width: 100%;
  }
  .margin-view {
    margin-bottom: 20px;
  }
  .send-view {
    height: 70px;
    align-items: center;
    display: flex;
    .currency {
      font-size: 14px;
      font-weight: bold;
    }
    .even-number {
      font-size: 20px;
      font-weight: 600;
      color: #2f2e50;
    }

    .small-number {
      color: #f48d3a;
      font-size: 20px;
      font-weight: 600;
    }
  }
  .label-note {
    margin-bottom: 10px;
    color: #868698;
    font-size: 13px;
    span {
      font-size: 11px;
      font-style: italic;
    }
  }
  .bank-payment {
    display: flex;
    justify-content: flex-start;
    margin-left: 20px;
  }
  .pay-method {
    margin-top: 10px;
    margin-bottom: 30px;
    font-size: 15px;
    font-weight: bold;
    color: #2f2e50;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 30px;

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

  .disableButton {
    opacity: 0.5;
  }

  .buttonWrap {
    margin-bottom: 15px;
  }
`;

export default PopupModal;
