import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const SendPaymentModal = styled(Modal)`
  min-width: 320px;
  padding: 20px;
  @media only screen and (max-width: 425px) {
    .ant-modal-content {
      margin: 10px;
    }
  }

  .minHeight {
    min-height: 50px;
  }

  .isoAutocompleteDropdown {
    position: relative;
    width: 100%;
    justify-content: center;
    display: flex;
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
    cursor: pointer;
    padding: 0;
    line-height: 1.5715;
    list-style: none;
    box-sizing: border-box;
    font-size: 14px;
    font-variant: initial;
    background-color: #fff;
    border-radius: 2px;
    outline: none;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    > .ant-spin-nested-loading {
      width: 100%;
    }
  }

  .user-item {
    text-align: left;
    padding: 10px 20px;
    display: flex;
    width: 100%;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #dddde5;
    &:hover,
    &:focus {
      background-color: rgba(81, 54, 154, 0.2);
      border-color: rgba(81, 54, 154, 0.2);
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
    padding: 30px 35px;

    .content {
      .highlight-user {
        font-weight: bold !important;
      }
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
    margin-bottom: 20px;
  }
  .title-contact {
    font-size: 15px;
    font-weight: bold;
  }
  .detail-contact {
    display: flex;
    align-items: center;
    margin-right: 20px;
    margin-top: 20px;
    cursor: pointer;
  }
  .contact-view {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
  }
  .bank-title-view {
    display: flex;
    max-width: 80px;
    justify-content: flex-start;
    align-items: center;
    margin-left: 10px;

    p {
      font-size: 13px;
      font-weight: normal;
    }
  }
  .avatar-icon {
    img {
      width: 36px;
      height: 36px;
      border-radius: 18px;
    }
  }
  .bottom-view {
    display: flex;
    flex-direction: row;
  }
  .manage-contact {
    align-self: center;
    button {
      color: #3b86ff;
    }
  }
`;

export const InputView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .leftContent {
    flex: 1;
    padding-right: 20;
  }
  .continueBtn {
    margin-bottom: 10px;
  }
  .inputEmail {
    margin-right: 20px;
    flex: 1;
    width: 100%;
    margin-bottom: 10px;
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
    margin-bottom: 10px;
  }
`;

export default SendPaymentModal;
