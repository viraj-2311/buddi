import styled from 'styled-components';
import Modal from '@iso/components/Feedback/Modal';

const LastStepConfirmationPopupContainer = styled(Modal)`
  .ant-modal {
    width: 700px;
  }

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
    .profile-area {
      display: flex;
      padding-top: 15px;
      @media screen and (max-width: 575px) {
        display: block;
      }
      .profile-img {
        @media screen and (max-width: 575px) {
          display: block;
          margin: 0 auto;
          text-align: center;
        }
        img {
          height: 95px;
          width: 95px;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .profile-inner {
        width: 100%;
        padding-left: 30px;
        @media screen and (max-width: 575px) {
          padding-left: 0px;
        }
        h5 {
          padding-top: 15px;
          font-size: 25px;
          font-weight: 700;
          color: #2f2e50;
          @media screen and (max-width: 575px) {
            font-size: 18px;
            text-align: center;
          }
          @media screen and (max-width: 360px) {
            font-size: 16px;
          }
          span {
            font-weight: 400;
          }
        }
        .isoInputWrapper {
          span {
            color: #868698;
          }
          .ant-input {
            margin-top: 6px;
          }
          button {
            min-width: 158px;
            height: 54px;
            margin: 30px 0 10px 0;
            border-color: #bcbccc;
            &.back-btn {
              width: 195px;
              span {
                color: #43425d !important;
              }
              @media screen and (max-width: 575px) {
                width: 48%;
              }
              @media screen and (max-width: 410px) {
                width: 100%;
              }
            }
            &.close-btn {
              background-color: #e25657;
              margin-left: 10px;
              @media screen and (max-width: 575px) {
                width: 48%;
              }
              @media screen and (max-width: 410px) {
                width: 100%;
              }
              &:hover {
                border-color: #e25657;
              }
              span {
                color: #fff;
              }
            }
          }
        }
      }
    }
    p {
      font-size: 15px;
      color: #2f2e50;
      margin: 0 0 20px 0;
      line-height: normal;
      letter-spacing: normal;
      letter-spacing: normal;
      @media screen and (max-width: 575px) {
        font-size: 13px;
        text-align: center;
      }
    }
  }
  .disableBtn {
    opacity: 0.5;
  }
`;
export { LastStepConfirmationPopupContainer };
