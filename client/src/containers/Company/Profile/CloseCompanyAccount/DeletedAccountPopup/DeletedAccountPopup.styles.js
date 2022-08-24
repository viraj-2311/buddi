import styled from 'styled-components';
import Modal from '@iso/components/Feedback/Modal';

const DeletedAccountPopupContainer = styled(Modal)`
  .modal-header {
    display: flex;
    justify-content: end;
  }

  .modal-inner {
    display: inline-flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    img {
      margin: 15px 0;
    }
    h5 {
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #2f2e50;
      margin: 20px 0;
      @media screen and (max-width: 575px) {
        font-size: 18px;
      }
    }
    .exit-btn {
      background: transparent;
      color: #fff;
      border-color: transparent;
      &:hover,
      &:active,
      &:focus {
        background: transparent;
        color: #fff;
        border-color: transparent;
      }
    }

    button {
      width: 55%;
      margin: 15px 0 0 0;
      @media screen and (max-width: 480px) {
        width: 70%;
      }
      @media screen and (max-width: 380px) {
        width: 90%;
      }
      @media screen and (max-width: 340px) {
        width: 95%;
      }
    }
  }
`;
export { DeletedAccountPopupContainer };
