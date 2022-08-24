import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import { palette } from 'styled-theme';

const WDInvoiceJobDetailWrapper = styled.div`
  width: 100%;
  background: #ffffff;

  .header-top {
    display: flex;
    flex-wrap: wrap;
  }

  .header-title {
    min-width: 130px;
    h1 {
      position: relative;
      font-size: 25px;
      font-weight: bold;
      color: #2f2e50;
      margin: 7px 0 0 0;
    }

    p {
      font-size: 15px;
      margin-bottom: 5px;
      color: #2f2e50;
    }

    .jobDetail {
      display: flex;
      strong {
        margin-right: 5px;
      }
      .jobId {
        margin-right: 25px;
      }
      .jobDate {
      }
    }
  }

  .header-left {
    display: flex;
    align-items: center;

    .goBackBtn {
      margin-right: 20px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-items: center;
    margin-left: auto;
    color: ${palette('text', 5)};

    .invoiceTotal {
      display: flex;
      align-items: center;
      justify-content: space-between;

      label {
        font-size: 22px;
        font-weight: bold;
        display: block;
        margin-right: 35px;
        @media only screen and (max-width: 425px) {
          font-size: 25px;
          margin-right: 10px;
        }
      }

      .totalAmount {
        font-size: 35px;
        font-weight: bold;
        @media only screen and (max-width: 425px) {
          font-size: 25px;
        }
      }
    }
  }
`;

const InvoiceJobDetailWrapper = WithDirection(WDInvoiceJobDetailWrapper);

export default InvoiceJobDetailWrapper;
