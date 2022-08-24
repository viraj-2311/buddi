import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceFormWrapper = styled.div`
  .btnLink {
    color: ${palette('themecolor', 0)};
  }
  .billingWrapper {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${palette('border', 11)};
    padding: 30px 25px;
    padding-top: 0;
    flex-wrap: wrap;
    @media only screen and (max-width: 375px) {
      padding: 0 15px;
    }

    .leftSideContent {
      display: flex;
      flex-direction: row;
      /* justify-content: space-between; */
      flex-wrap: wrap;

      .billFrom,
      .billTo {
        width: 230px;
        min-width: 230px;
        margin-right: 30px;
        margin-top: 30px;
      }

      .title {
        font-size: 15px;
        font-weight: bold;
        color: ${palette('text', 5)};
        margin-bottom: 10px;
      }

      p {
        margin-bottom: 10px;
      }
    }

    .rightSideContent {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 200px;
      min-width: 200px;

      .formGroup {
        margin-bottom: 20px;
        label {
          color: #868698;
          font-size: 13px;
          margin-bottom: 8px;
          display: inline-block;
        }
      }
    }
  }

  .memoWrapper {
    padding: 30px 25px;
    border-bottom: 1px solid ${palette('border', 11)};
    @media only screen and (max-width: 425px) {
      padding: 30px 15px;
    }

    .title {
      font-size: 14px;
      font-weight: bold;
      color: ${palette('text', 5)};
    }

    .invoiceMemoInfo {
      .dealMemoColumn {
        width: 100%;
        .date-rate {
          margin-top: 15px;
          min-width: 180px;
          .ant-input-group {
            margin-bottom: 0;
          }
        }
        .hour-per-day {
          margin-top: 15px;
          min-width: 120px;
          .formGroup {
            margin-bottom: 0;
          }
        }
        .project-rate {
          margin-top: 15px;
          min-width: 120px;
        }
        .kit-fee {
          margin-top: 15px;
          min-width: 120px;
        }
        .notes {
          margin-top: 15px;
          min-width: 250px;
          @media only screen and (max-width: 375px) {
            min-width: 225px;
          }
        }
      }

      .priceTypeOption {
        margin-bottom: 8px;
      }

      .saveBtn {
        width: 200px;
      }
    }

    .rateFields {
      margin-top: 15px;
      padding-bottom: 15px;

      .rateList {
        margin-bottom: 20px;

        .viewRate {
          display: flex;
          flex-wrap: wrap;
          margin-left: -15px;

          .viewRateCol {
            width: calc(20% - 30px);
            min-width: 205px;
            margin-left: 15px;
            margin-right: 15px;
          }
        }

        .editRate {
          padding: 20px;
          background-color: #fafafa;
          border: 1px solid #e8e8f1;
          border-radius: 5px;
          margin-top: 25px;

          .rateFieldRow {
            margin-bottom: 10px;
            .ant-col {
              margin-bottom: 10px;
            }
          }

          .ant-input-group {
            margin: 0;
          }
          .rateTypeOption {
            margin-bottom: 7px;
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
          margin-top: 28px;
          margin-left: 10px;
        }
        .editBtn {
          background-image: none;
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;

      button {
        width: 200px;
        height: 50px;
      }
      .saveBtn {
        border-color: #2f2e50;
        color: #2f2e50;
      }
    }
  }
`;

export default InvoiceFormWrapper;
