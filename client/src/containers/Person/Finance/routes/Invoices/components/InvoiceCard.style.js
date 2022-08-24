import styled from 'styled-components';
import { palette } from 'styled-theme';

const ContractorInvoiceCardWrapper = styled.div`
  width: 100%;
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #f0f0f7;
  background-color: #ffffff;
  position: relative;

  .moreAction {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .invoiceHeader {
    margin-bottom: 22px;
    .timeAgo {
      margin-left: 10px;
    }
  }

  .invoiceBody {
    color: ${palette('text', 5)};

    .jobTitle {
      font-size: 25px;
      font-weight: bold;
    }

    .jobHeadText {
      margin-bottom: 22px;
    }

    .jobText {
      font-size: 13px;
      display: flex;
      margin-bottom: 18px;
      justify-content: space-between;

      .inlineText {
        display: flex;
        align-items: center;
        margin-right: 20px;
      }

      .blockText {
        &:first-child {
          margin-left: 0;
        }
        margin-left: 15px;
      }

      @media (max-width: 425px) {
        display: block;
        .blockText {
          margin: 0 0 10px 0;
        }
      }
    }
  }

  .invoiceFooter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0 0 0;
    border-top: 1px solid #d9d9e2;
    flex-wrap: wrap;

    @media (max-width: 425px) {
      flex-direction: column;
      text-align: center;
      button {
        margin-top: 15px;
      }
    }

    h2.totalPayPrice {
      font-size: 25px;
      font-weight: bold;
      color: ${palette('text', 0)};
      margin-right: 10px;
    }

    button {
      height: 40px;
      margin-bottom: 10px;
      &.editInvoice {
        border-color: #43425d;
        &:hover {
          border-color: ${palette('themecolor', 0)} !important;
        }
      }
    }
  }
`;

export default ContractorInvoiceCardWrapper;
