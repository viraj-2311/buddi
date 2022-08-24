import styled from 'styled-components';
import { palette } from 'styled-theme';

const ProducerInvoiceCardWrapper = styled.div`
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
    > div {
      margin-bottom: 5px;
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
  }

  .invoiceFooter {
    padding: 15px 0 0 0;
    border-top: 1px solid #d9d9e2;

    h2.totalPayPrice {
      font-size: 25px;
      font-weight: bold;
      color: ${palette('text', 0)};
    }

    button {
      height: 40px;
      &.editInvoice {
        border-color: #43425d;
        &:hover {
          border-color: #4482ff;
        }
      }
    }
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

      .rate {
        font-size: 18px;
        line-height: normal;
        margin-top: 8px;
      }
    }

    @media (max-width: 425px) {
      display: block;
      .blockText {
        margin: 0 0 10px 0;
      }
    }

    .green {
      color: #19913d;
    }
  }
`;

export default ProducerInvoiceCardWrapper;
