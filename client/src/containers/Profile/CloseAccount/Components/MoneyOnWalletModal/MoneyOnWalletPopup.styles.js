import styled from "styled-components";
import Modal from "@iso/components/Feedback/Modal";

const MoneyOnWalletPopupContainer = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #b4b4c6;
    padding: 30px;
    h5 {
      font-size: 25px;
      font-weight: 700;
      color: #2f2e50;
      @media screen and (max-width: 575px) {
        font-size: 18px;
      }
      @media screen and (max-width: 360px) {
        font-size: 16px;
      }
    }
  }
  .modal-body {
    padding: 30px;
    p {
      font-size: 15px;
      color: #2f2e50;
      margin: 0 0 20px 0;
      line-height: normal;
      letter-spacing: normal;
      letter-spacing: normal;
      @media screen and (max-width: 575px) {
        font-size: 13px;
      }
    }
    .b-wallet-btn {
      width: 158px;
      height: 54px;
      margin: 30px auto 20px auto;
      display: block;
    }
  }
`;
export { MoneyOnWalletPopupContainer };
