import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceServiceFormWrapper = styled.div`
  .customServiceRow {
    flex-wrap: wrap;
    margin-bottom: 15px;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }
    .document-title {
      min-width: 120px;
      margin-top: 15px;
    }
    .units {
      min-width: 120px;
      margin-top: 15px;
    }
    .number-of-days {
      min-width: 120px;
      margin-top: 15px;
    }
    .rate {
      min-width: 120px;
      margin-top: 15px;
    }
    .total-amount {
      min-width: 120px;
      margin-top: 15px;
    }
    .notes {
      min-width: 250px;
      flex: 1;
      margin-top: 15px;
      @media only screen and (max-width: 375px) {
        min-width: 225px;
      }
    }

    .formGroup {
      label {
        font-size: 13px;
      }
    }
    .actionColumn {
      margin-top: 10px;
      min-width: 65px;
      @media only screen and (max-width: 466px) {
        margin-top: 0;
      }

      .ant-btn-circle {
        color: #9697a7;
        border: none;
        width: 35px;
        height: 35px;
      }
      .closeCircle {
        svg {
          height: 20px;
          width: 20px;
        }
      }
    }
  }

  .addLineItemFieldBtn {
    color: ${palette('themecolor', 0)};
  }

  .serverMessage {
    margin-top: 10px;
  }

  .serviceAction {
    text-align: right;
    margin-top: 15px;

    button {
      width: 200px;
      height: 50px;
    }
    .saveBtn {
      border-color: #2f2e50;
      color: #2f2e50;
    }
  }

  .serviceFormFooter {
    text-align: center;
    padding: 30px;
    margin-top: 30px;
  }

  .formGroup {
    margin-bottom: 10px;

    .fieldLabel {
      display: block;

      &.required::after {
        content: '*';
        color: #eb5757;
      }
    }

    .helper-text {
      color: #eb5757;
    }
  }
`;

export default InvoiceServiceFormWrapper;
