import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import Modal from '@iso/components/Modal';

export const EmptyWallet = styled.div`
  text-align: center;
  padding: 150px 30px;
  margin: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;

  h2 {
    font-size: 25px;
    color: #2f2e50;
    font-weight: bold;
    margin-top: 30px;
  }
  img {
    width: 100%;
    max-width: 496px;
    min-width: 196px;
  }
`;

export const LoadingWallet = styled.div`
  height: calc(100% - 40px);
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
`;

const WalletContent = styled.div`
  width: 100%;
  margin: auto;
  padding: 30px;
  @media only screen and (max-width: 767px) {
    padding: 30px 0;
  }
  .ant-row {
    @media only screen and (max-width: 767px) {
      margin: 0 !important;
    }
  }
  .ant-col {
    padding: 0 !important;
    padding-right: 40px !important;
    margin-bottom: 40px;
    @media only screen and (max-width: 767px) {
      padding-right: 0 !important;
    }
  }

  .walletInfo {
    text-align: left;
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    background-image: linear-gradient(to right, #222229, #3f475b);
    color: #ffffff;
    justify-content: center;
    @media only screen and (max-width: 767px) {
      min-width: 280px;
    }
    @media only screen and (min-width: 768px) {
      min-width: 320px;
    }
    .wallet-shadow {
      position: absolute;
      left: 10px;
      right: 55px;
      min-width: 300px;
      height: 8px;
      top: -8px;
      opacity: 0.24;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border: solid 1px #707070;
      background-image: linear-gradient(
        to right,
        #2e2c6d,
        #5838a3 50%,
        #6b3dbc
      );
      @media only screen and (max-width: 767px) {
        right: 10px;
      }
    }
  }
  .top-content {
    display: flex;
    flex-wrap: wrap;
    padding: 30px;
    padding-bottom: 0;
    @media only screen and (max-width: 470px) {
      padding: 15px;
    }
  }
  .benji-logo {
    flex: 1;
    height: 60px;
    align-items: center;
    display: flex;
    margin-right: 20px;
    margin-bottom: 30px;
    img {
      height: 50px;
    }
  }

  .wallet-info {
    width: 100%;
  }

  .walletHistory {
    padding-left: 0 !important;
    @media only screen and (min-width: 768px) {
      min-width: 320px;
    }
  }

  .walletAccount {
    padding-left: 0 !important;
    padding-right: 0 !important;
    @media only screen and (max-width: 767px) {
      min-width: 280px;
    }
    @media only screen and (min-width: 768px) {
      min-width: 320px;
    }
  }

  .business-member-view {
    margin-top: 30px;
  }

  .recent-activity {
    margin-top: 40px;
  }

  .wallet-action {
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: flex-end;
    min-width: 150px;
    margin-bottom: 30px;
    @media only screen and (max-width: 470px) {
      justify-content: flex-start;
    }
  }

  .wallet-account {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .button-wallet {
    justify-content: center;
    font-size: 13px;
    text-align: center;
    display: flex;
    flex-direction: column;
    img {
      width: 20px;
      height: 20px;
      margin-left: 2px;
    }
    .title {
      font-size: 13px;
      font-weight: 600;
      margin-top: 10px;
      color: white;
      align-self: center;
    }
    .historyIcon {
      margin-right: 4px;
    }
    button {
      display: flex;
      flex-direction: column;
    }
  }
  .button-bank-link {
    justify-content: center;
    font-size: 13px;
    text-align: center;
    margin: 30px;
    .plus-icon {
      position: absolute;
      right: -11px;
      bottom: 0;
      border-radius: 11px;
      background-color: white;
      img {
        width: 20px;
        height: 20px;
        margin: 2px;
      }
    }
  }

  .business-member {
    justify-content: center;
    flex-direction: row;
    display: flex;
    font-size: 13px;
    text-align: center;
    margin: 30px;
    .account-icon {
      position: relative;
      padding: 22px;
      margin: auto;
      text-align: center;
      border-radius: 10px;
      background-color: #f48d3a;
      width: 84px;
    }
    .member-icon {
      position: relative;
      padding: 0;
      margin: auto;
      text-align: center;
      border-radius: 10px;
      background-color: #f48d3a;
    }
    .desc-member {
      text-align: left;
      span {
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
    .plus-icon {
      position: absolute;
      right: -11px;
      bottom: 0;
      border-radius: 11px;
      background-color: white;
      img {
        width: 20px;
        height: 20px;
        margin: 2px;
      }
    }
    .add-button {
      min-width: 80px;
      height: 30px;
      background-image: linear-gradient(to right, #6e52fc, #52a0f8);
      border: none;
      margin-top: 7px;
      align-self: center;
      span {
        font-size: 13px;
        padding: 5px;
        display: block;
      }
    }
  }

  .disableButton {
    opacity: 0.5;
  }

  .icon-circle-border {
    width: 38px;
    height: 38px;
    align-self: center;
    border-radius: 19px;
    background-color: white;
    justify-content: center;
    display: flex;
    align-content: center;
    align-items: center;
  }

  .button-wallet-padding {
    padding-left: 15px;
    padding-right: 15px;
  }
  .border-line {
    width: 100%;
    height: 1px;
    opacity: 0.5;
    background-color: white;
  }
  .border-activity {
    width: 100%;
    height: 1px;
    opacity: 0.5;
    background-color: #b4b4c6;
  }
  .total-balance {
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
  }
  .balance {
    display: flex;
    flex-direction: row;
    padding: 30px;
    padding-bottom: 20px;
    flex-wrap: wrap;
    @media only screen and (max-width: 470px) {
      padding: 15px;
    }
    .bank-button {
      color: #ffffff;
    }
  }
  .transfer-view {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .title-wallet {
    font-size: 17px;
    font-weight: bold;
  }
  .even-number {
    font-size: 40px;
    font-weight: 600;
    color: #ffffff;
  }
  .small-number {
    color: #f48d3a;
    font-size: 40px;
    font-weight: 600;
  }
  .title-header {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    color: var(--dark);
  }

  .content-activity {
    background-color: white;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    border-color: transparent;
    border-radius: 10px;
    margin-top: 30px;
    @media only screen and (max-width: 767px) {
      min-width: 280px;
    }

    .transfer-item {
      flex: 1;
      :hover {
        background-color: #f0f0f7;
        border-left: 3px solid #51369a;
        cursor: pointer;
      }
    }
    .borderItem {
      border-bottom: dotted 1px #b4b4c6;
    }
    .borderItemNormal {
      border-bottom: solid 1px #b4b4c6;
    }
    span {
      font-size: 15px;
      color: var(--dark);
      padding: 30px;
      display: block;
    }
  }

  .content-members {
    background-color: white;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    border-color: transparent;
    border-radius: 10px;
    margin-top: 30px;
    @media only screen and (max-width: 767px) {
      min-width: 280px;
    }
  }

  .request-payment-activity {
    background-color: #43425d;
    margin-bottom: 30px;
  }

  .activity-button {
    margin-left: 30px;
    margin-right: 30px;
    align-items: center;
    display: flex;
    background-color: transparent !important;

    span {
      display: inherit;
      padding-left: 5px;
      color: #3b86ff;
      font-size: 15px;
      margin-left: 10px;
    }
  }
  .account-icon {
    position: relative;
    padding: 22px;
    margin: auto;
    text-align: center;
    border-radius: 10px;
    background-color: #f48d3a;
    width: 84px;
    img {
      width: 35px;
      height: 35px;
    }
  }
  .title-link-account {
    font-size: 15px;
    font-weight: bold;
    color: var(--dark);
    margin-top: 10px;
  }
  .link-bank-wallet {
    display: flex;
    justify-content: flex-start;
    padding: 30px;
    position: relative;

    .menu-option {
      position: absolute;
      top: 10px;
      right: 15px;
      padding: 1px 5px;
      cursor: pointer;
      img {
        width: 20px;
        height: 5px;
      }
    }

    .company-logo {
      width: 15px;
      height: 29px;
    }

    img {
      width: 28px;
      height: 22px;
    }

    .cover-icon {
      width: 82px;
      min-width: 82px;
      height: 52px;
      border-radius: 10px;
      background-color: #f5f7fa;
      justify-content: center;
      align-items: center;
      display: flex;
      border: solid 1px #f48d3a;
    }
    .bank-title {
      font-size: 15px;
      font-weight: bold;
      color: var(--dark);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bank-title-view {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 30px;
      width: 100%;
      position: relative;
      overflow: hidden;
    }
  }
`;

export const WrapperModal = styled(Modal)`
  min-width: 320px;
  padding: 20px;
  @media only screen and (max-width: 425px) {
    padding: 5px;
    .ant-modal-content {
      margin: 10px;
    }
  }

  .ant-modal-header {
    border-bottom: solid 2px rgba(180, 180, 198, 0.5);
  }

  .ant-modal-body {
    padding: 30px 35px;
    @media only screen and (max-width: 425px) {
      padding: 15px;
    }
  }
`;

export default WithDirection(WalletContent);
