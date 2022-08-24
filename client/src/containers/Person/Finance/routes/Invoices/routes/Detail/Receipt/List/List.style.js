import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceReceiptListWrapper = styled.div`
  width: 100%;

  .receiptItem {
    height: auto;
    display: flex;
    border: solid 1px #f0f0f7;
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);

    .receiptThumb {
      min-width: 160px;
      background-color: #cfcfcf;
      height: 145px;
      margin-right: 40px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100px;
      }
    }

    .receiptText {
      p,
      h3,
      h4 {
        color: #2f2e50;
        word-break: break-word;
      }
      h3,
      h4 {
        font-weight: bold;
      }

      p {
        margin-bottom: 5px;
      }

      .receiptAmount {
        margin-top: -5px;
        font-size: 25px;
      }
      .receiptTitle {
        margin-bottom: 5px;
      }
    }
  }

  .receiptAction {
    position: absolute;
    right: 25px;
    display: flex;
    flex-direction: column;

    button {
      margin-bottom: 10px;

      svg {
        color: #2f2e50;
      }
    }
  }
`;

export default InvoiceReceiptListWrapper;
