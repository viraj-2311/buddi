import styled from 'styled-components';
import { palette } from 'styled-theme';

const ContractorInvoiceDetailWrapper = styled.div`
  width: 100%;
  .btnLink {
    color: #3b86ff;
  }

  .totalPrice {
    display: flex;
    min-width: 205px;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    label {
      display: block;
      margin-right: 20px;
    }
    span {
      min-width: 80px;
      text-align: right;
    }
  }
  .PageHeader {
    padding: 30px 70px 30px 30px;
    background: #ffffff;

    .invoiceNumberWrapper {
      display: flex;
      align-items: center;
      margin-left: 40px;

      .invoiceNumber {
        font-size: 25px;
        font-weight: bold;
        color: ${palette('text', 5)};
      }

      button {
        margin-left: 20px;
        color: ${palette('themecolor', 0)};
      }
    }

    .goBackBtn {
      margin-right: 10px;
      padding: 0 0 15px 10px;
    }

    .jobInfoWrapper {
      display: flex;
      flex-direction: row;
      margin-top: 15px;
    }
  }

  .PageSubHeader {
    padding: 22px 70px 16px 70px;
    display: flex;
    align-items: center;

    .inlineTextBlock {
      color: ${palette('text', 5)};
      margin-right: 30px;

      label {
        font-size: 15px;
        font-weight: bold;
        margin-right: 10px;
      }
    }
  }

  .divider {
    border: 1px solid #b4b4c6;
  }

  .PageContent {
    padding: 30px 70px;
    @media only screen and (max-width: 768px) {
      padding: 20px 30px;
    }
    .inDispute {
    }
    .pageTitle {
      h2 {
        font-weight: bold;
        font-size: 20px;
        color: #2f2e50;
      }
      margin-bottom: 20px;
    }
  }
`;

const ContractorInvoiceEditWrapper = styled.div`
  .editButtonWrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 30px;

    .totalInvoice {
      margin-top: 15px;
      display: flex;
      align-items: center;
      font-size: 35px;
      font-weight: bold;
      label {
        font-size: 22px;
        margin-right: 25px;
      }
    }

    button {
      margin-left: 20px;
      margin-top: 15px;
      width: 200px;
      &:last-child {
        margin-right: 0;
      }

      &.blackBorder {
        border-color: #2f2e50;
        color: #2f2e50;
      }
    }
  }

  .invoiceForm {
    padding: 0;
    border-radius: 10px;

    .invoiceFormHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid ${palette('border', 0)};
      padding: 25px 30px;
      padding-top: 0;
      flex-wrap: wrap;
      @media only screen and (max-width: 375px) {
        padding: 0 15px;
      }

      .leftSideAction {
        height: 50px;
        margin-top: 25px;
        > .ant-radio-group > .ant-radio-button-wrapper {
          @media only screen and (max-width: 500px) {
            min-width: 100px;
            padding: 0 10px;
          }
          @media only screen and (max-width: 425px) {
            min-width: 80px;
            font-size: 12px;
          }
        }
      }
      .rightSideAction {
        height: 50px;
        align-content: center;
        display: flex;
        margin-top: 25px;
        @media only screen and (max-width: 425px) {
          margin-bottom: 25px;
        }
      }
    }

    .invoiceFormBody {
      padding: 0;
    }

    .invoiceFormFooter {
      margin-bottom: 30px;
      text-align: center;
    }

    .documentListWrapper {
      padding: 30px 25px;
      border-bottom: 1px solid ${palette('border', 0)};
    }

    .serviceSection {
      padding: 30px 25px;
      @media only screen and (max-width: 425px) {
        padding: 30px 15px;
      }
      .serviceWrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        .title {
          font-size: 15px;
          font-weight: bold;
          color: ${palette('text', 5)};
        }
      }
      .serviceForm {
        margin-top: 10px;
      }
    }
  }

  .receiptForm {
    padding: 0;
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);

    .receiptFormHeader {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      padding: 30px 30px;
      border-bottom: 1px solid ${palette('border', 11)};
      @media only screen and (max-width: 425px) {
        padding: 20px 15px;
      }

      .title {
        font-size: 20px;
        font-weight: bold;
        margin-right: 50px;
      }
    }

    .receiptFormBody {
      padding: 30px;
      padding-top: 0;
      @media only screen and (max-width: 425px) {
        padding: 20px 15px;
      }
    }

    .uploadFormWrapper {
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 1px solid ${palette('border', 11)};
    }
  }

  .invoicePreview {
    padding: 0;

    .invoicePreviewHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 25px 30px;
      border-bottom: 1px solid ${palette('border', 11)};
      @media only screen and (max-width: 425px) {
        padding: 20px 15px;
      }

      .title {
        font-size: 20px;
        font-weight: bold;
      }

      .actions {
        button {
          margin-left: 20px;
        }
      }
    }

    .invoicePreviewBody {
      /* max-width: 900px; */
      background-color: #bcbccb;
      margin: auto;
      overflow: scroll;
    }
  }
`;

const ContractorInvoiceViewWrapper = styled.div`
  .invoiceView {
    padding: 0;
    border-radius: 10px;

    .invoiceViewHeader {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 25px 30px;
      border-bottom: 2px solid ${palette('border', 0)};

      .title {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .invoiceViewBody {
      padding: 25px 30px;
    }

    .paymentSentInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      .totalInvoicePrice {
        font-size: 20px;
        font-weight: bold;
        color: ${palette('text', 5)};
        vertical-align: middle;
      }
    }

    .editInvoiceBtn,
    .resendInvoiceBtn {
      background: #e8e8f1;
      color: #ffffff;
    }
  }

  .invoicePreview {
    padding: 0;
    border-radius: 10px;

    .invoicePreviewHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 25px 30px;
      border-bottom: 1px solid ${palette('border', 11)};

      .title {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .invoicePreviewBody {
      /* max-width: 900px; */
      background-color: #bcbccb;
      margin: auto;
    }
  }
`;

const ActionDiv = styled.div`
  display: flex;
  align-items: center;
  .ant-btn-circle {
    color: #2f2e50;
    margin-right: 20px;
    background: #f5f7fa;
    border: none;
    width: 35px;
    height: 35px;
    min-width: 0;
    &:last-child {
      margin-right: 0;
    }

    svg {
      color: #2f2e50;
      height: 22px;
      width: 22px;
    }
  }
`;

const MessageDiv = styled.div`
  border: ${(props) => `1px solid ${props.color}`};
  background: #fff;
  padding: 20px 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 25px;

  h4 {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  h4,
  p {
    color: #2f2e50;
  }

  a {
    margin-left: auto;
    svg {
      color: #2f2e50;
      height: 20px;
      width: 20px;
    }
  }

  > div {
    position: relative;
    margin-right: 40px;
    padding-left: 20px;
  }

  .messageBorder {
    position: absolute;
    width: 4px;
    border-radius: 5px;
    height: 100%;
    left: 0;
    top: 0;
    background-color: ${(props) => props.color};
  }
`;

export {
  ContractorInvoiceEditWrapper,
  ContractorInvoiceViewWrapper,
  ActionDiv,
  MessageDiv,
};

export default ContractorInvoiceDetailWrapper;
