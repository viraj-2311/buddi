import styled from 'styled-components';

const ChangeBankWrapper = styled.div`
  .content {
    .ant-radio-wrapper-checked {
      background-color: #f0f0f7;
    }

    .ant-radio-inner {
      border-color: #bcbccb;
    }

    .ant-radio-inner::after {
      background-color: #51369a;
    }

    .bank-account-view {
      border-radius: 10px;
      border: 1px solid #f0f0f7;
      padding: 25px 101px 25px 20px;
      margin-bottom: 20px;
      margin-right: 0;

      .bank-account-view-inner-content {
        display: flex;
        margin-left: 12px;

        .cover-icon {
          width: 82px;
          height: 52px;
          border-radius: 10px;
          background-color: #fff;
          justify-content: center;
          align-items: center;
          display: flex;
          border: solid 1px #f48d3a;
          img {
            width: 28px;
            height: 22px;
          }
        }

        .bank-title-block {
          margin-left: 20px;
          color: #2f2e50;

          .bank-title {
            font-size: 15px;
            font-weight: normal;
            width: 160px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 5px;
          }

          .bank-title-savings {
            font-size: 13px;
            font-weight: bold;

            .bank-account-number {
              margin-left: 20px;
            }
          }
        }
      }
    }

    .add-new-bank-btn {
      font-size: 15px;
      font-weight: bold;
      color: #3b86ff;
      padding: 0;
    }

    .footer-button-container {
      text-align: center;
      margin-top: 30px;

      .ant-form-item-control-input-content {
        display: flex;
        justify-content: space-between;

        button {
          padding: 15px 83px;
        }
      }
    }
  }

  @media only screen and (max-width: 540px) {
    .content {
      .bank-account-view {
        padding-right: 50px;

        .bank-account-view-inner-content {
          .bank-title-block {
            .bank-title {
              width: 150px;
            }
          }
        }
      }

      .footer-button-container {
        .ant-form-item-control-input-content {
          button {
            padding: 15px 63px;
          }
        }
      }
    }
  }
`;

export default ChangeBankWrapper;
