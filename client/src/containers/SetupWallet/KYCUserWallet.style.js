import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const KYCWalletStyleWrapper = styled.div`
  .kyc-wallet-container {
    max-width: 768px;
    margin: auto;
    padding: 30px;

    @media only screen and (max-width: 767px) {
      padding: 30px 20px;
    }

    @media only screen and (max-width: 374px) {
      padding: 20px 10px;
    }
  }

  .bottom-container {
    background-color: white;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 20px;
  }

  .setup-wallet-container__header {
    text-align: center;
    color: white;
    .icon {
      display: inline-block;
      margin: 10px;
      background: #808bff;
      padding: 5px 15px;
      border-radius: 10px;
      font-size: 30px;
    }
  }

  .kyc-wallet {
    background: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    min-height: 100px;
    margin-top: 50px;
    padding: 20px;
  }

  .failed-container {
    background-color: #fbeded !important;
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
  .description-address {
    font-size: 15px;
    margin-top: 20px;
    margin-bottom: 15px;
    display: block;
    text-align: left;
    color: var(--dark);
  }
  .overview-message {
    padding: 10px;
    border-radius: 5px;
    border: solid 1px #bcbccb;
    background-color: rgba(59, 134, 255, 0.1);
    flex-direction: row;
    flex: 1;
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    .info-desc {
      margin-left: 10px;
    }
    svg {
      align-self: center;
    }
  }

  .buttonWrap {
    font-size: 14px;
    width: 150px;
    min-width: 150px;
    margin-top: 20px;
  }
  .disableButton {
    opacity: 0.5;
  }
  .buttonWrapBack {
    font-size: 14px;
    width: 150px;
    min-width: 150px;
    margin-right: 20px;
    margin-top: 20px;
    color: var(--dark) !important;
    background-image: linear-gradient(to right, #ffffff, #ffffff) !important;
    border-color: #43425d !important;
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
    .pending {
      background-color: #ffa177;
      border-radius: 5px;
      padding: 3px 15px;
      color: #ffffff;
      font-weight: bold;
    }
    .success {
      background-color: #19913d;
      border-radius: 5px;
      padding: 3px 15px;
      color: #ffffff;
      font-weight: bold;
    }
    .failed {
      background-color: #ff6565;
      border-radius: 5px;
      padding: 3px 15px;
      color: #ffffff;
      font-weight: bold;
    }
  }
  .documents-guide {
    margin-bottom: 10px;
  }
  .list-file-upload {
    font-size: 15px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 15px;
    display: block;
    text-align: left;
    color: var(--dark);
  }
  .upload-document {
    margin-top: 20px;
  }

  ul {
    padding-left: 14px;
    margin-left: 5px;
    list-style-type: disc;
    li {
      &::marker {
        font-size: 12px;
        color: var(--dark);
      }
    }
  }
  .document-require {
    padding: 20px;
    border-radius: 5px;
    border: solid 1px #bcbccb;
    background-color: rgba(59, 134, 255, 0.1);
    margin-top: 20px;
    margin-bottom: 20px;
    .info-desc {
      align-content: center;
      display: flex;
      svg {
        margin-right: 10px;
        align-self: center;
      }
      span {
        font-size: 15px;
        font-weight: bold;
      }
    }
    ol {
      margin-top: 15px;
      padding-left: 0;
      margin-left: 5px;
      list-style-type: none;
      counter-reset: step-counter;
      li {
        counter-increment: step-counter;
        &::before {
          margin-right: 8px;
          content: counter(step-counter) '. ';
          font-size: 15px;
          color: var(--dark);
        }
      }
    }
  }
`;

export default WithDirection(KYCWalletStyleWrapper);
