import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceMemoWrapper = styled.div`
  .invoiceMemoWrapper {
    padding: 25px 30px;

    .title {
      margin-bottom: 20px;
    }

    .rateFields {
      padding-bottom: 20px;
      .rateList {
        margin-bottom: 20px;

        .editRate {
          padding: 20px;
          background-color: #fafafa;
          border: 1px solid #e8e8f1;
          border-radius: 5px;
          margin-top: 25px;

          .ant-input-group {
            margin: 0;
          }
          input {
            margin-bottom: 10px;
          }
        }

        .rateUpdate {
          position: relative;

          button {
            position: absolute;
            right: 15px;
            top: 15px;
            width: auto;
            margin: 0;
            z-index: 1;
          }
        }

        .hourlyRate {
          display: flex;

          .dayRate {
            width: 70%;

            .ant-input {
              border-radius: 0 4px 4px 0;
            }
          }
        }
        button {
          width: 110px;
          margin-top: 25px;
          margin-left: 10px;
        }
        .editBtn {
          background-image: none;
        }
      }

      .addRateFieldBtn {
        color: ${palette('themecolor', 0)} !important;
      }
    }

    .memo-time-picker{
      height: 50px;
      text-align: left;
      font-size: 15px;
      line-height: 1.5;
      color: #595959;
      background-color: #fafbff;
      background-image: none;
      border: 1px solid #bcbccb;
      border-radius: 4px;
      &:focus,
      &:hover{
        border-color:${palette('themecolor', 0)} !important;
        box-shadow:none !important;
      }
    }
    
    .actions {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #d9d9e2;
      padding-top: 30px;

      input[type='file'] {
        display: none;
      }

      button {
        min-width: 160px;
        height: 54px;
        margin-right: 20px;

        &.ant-btn-circle {
          background: #e0e1e9;
          width: 54px;
          height: 54px;
          min-width: 0;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .dealViewRate {
    display: flex;
    flex-wrap: wrap;
    .hourlyRate {
      display: flex;

      .dayRate {
        width: 70%;

        .ant-input {
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }

  .jobMemoWrapper {
    background: #f5f7fa;
    padding: 20px 30px 0px 30px;
    border-bottom: 1px solid #d9d9e2;
    .jobMemoCollapse {
      .ant-collapse-header {
        border-bottom: 1px solid #d4d5df;
        padding: 13px 0;
      }

      .ant-collapse-content-box {
        padding: 15px 0;
      }
    }
    .payTermsField {
      display: flex;
      justify-content: center;

      span {
        border-radius: 5px 0 0 5px;
        height: 50px;
        background: #fafbff;
        border: 1px solid #d9d9d9;
        border-right: none;
        display: flex;
        align-items: center;
        padding: 0 15px;
      }
      > .ant-input {
        border-radius: 0 5px 5px 0;
      }

      .disable {
        background: ${palette('background', 5)};
        color: ${palette('text', 9)};
      }
    }
  }

  .divider {
    border-top: 1px solid #d4d5df;
    margin: 20px 0;
  }

  .helper-text {
    color: #eb5757;
  }

  .priceTypeOption,
  .rateTypeOption {
    margin-bottom: 8px;
  }
`;

const InvoiceMemoSectionTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${palette('text', 5)};
`;

const TotalAmountContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
  font-weight: bold;
  padding: 18px 0 6px 0;
  margin-top: 30px;
  border-top: 1px solid #d9d9e2;

  &.newTotalAmount {
    padding: 18px 0;
  }
`;

export { InvoiceMemoSectionTitle, TotalAmountContainer };
export default InvoiceMemoWrapper;
