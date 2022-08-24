import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const WalletNotSet = styled(Modal)`
  &.ant-modal {
    @media (max-width: 1024px) {
      width: calc(100% - 60px) !important;
    }
  }
  .ant-modal-content {
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  }
  
  .ant-modal-header {
    padding: 40px 40px 30px 40px;
    border-radius: 10px 10px 0 0;

    .ant-modal-title {
      display: flex;
      justify-content: space-between;
      h3 {
        font-size: 25px;
        font-weight: bold;
        line-height: normal;
        color: #2f2e50;
      }
    }
  }

  .ant-modal-body {
    padding: 35px 40px 45px 40px;
    h3 {
      font-size: 20px;
    }
    h4,
    p {
      font-size: 15px;
    }

    h3,
    h4 {
      font-weight: bold;
    }
    .content {
      h3,
      h4,
      p {
        color: #2f2e50;
      }
      .title {
        border-bottom: 1px solid ${palette('border', 11)};
        padding-bottom: 20px;
      }
    }
    .sourceList {
      margin-bottom: 30px;
      .sourceItem {
        justify-content: space-between;
        border-bottom: 1px solid ${palette('border', 11)};
        padding: 20px;

        .ant-col {
          display: flex;
          align-items: center;
        }
      }
    }

    .paymentInfo {
      h3 {
        margin-bottom: 20px;
        line-height: normal;
      }
      margin-bottom: 30px;

      .payment-source-item {
        display: flex;
        flex-direction: row;
        margin-top: 30px;

        .payment-source-image {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 82px;
          height: 52px;
          border: solid 1px #bcbccb;
          background-image: linear-gradient(to bottom, #2e2c6d, #5838a3 62%, #6b3dbc);
          border-radius: 10px;
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
          margin-right: 20px;
        }

        .payment-source-details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #2f2e50;
        }
      }

      .payment-source-bank {
        .payment-source-image {
          background: #fff;
          border: 1px solid #51369a;
        }
      }
      
      .change-bank-btn {
        margin-top: 15px;
        
        span {
          color: #3b86ff;
        }
      }
    }

    .closeBtn {
      position: absolute;
      right: 30px;
      top: 30px;
    }

    .title {
      font-size: 25px;
      color: ${palette('text', 5)};
      font-weight: bold;
      line-height: normal;
    }

    .description {
      font-size: 15px;
      max-width: 250px;
      color: ${palette('text', 5)};
      margin: 0 auto 30px auto;
    }

    .actions {
      margin-bottom: 30px;

      @media (max-width: 620px) {
        display: flex;
        flex-direction: column;
      }

      button {
        font-size: 15px;
        margin-right: 20px;
        padding: 0 30px;
        @media (max-width: 620px) {
          margin-right: 0px;
          padding: 0 20px;
          font-size: 14px;
        }
        @media (max-width: 400px) {
          padding: 0 10px;
          font-size: 11px;
        }

        &.debitBtn {
          background-color: #19913d;
          border-color: #19913d;
          color: #ffffff;

          &:hover,
          &:focus {
            background-color: #19913d;
            border-color: #19913d;
          }
        }

        &.cancelBtn {
          @media (max-width: 620px) {
            width: auto;
            margin-top: 20px;
          }
          width: 160px;
          border-color: #2f2e50;
          color: #2f2e50;
        }
      }
    }
  }
`;

export default WalletNotSet;
