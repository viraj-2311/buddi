import styled from 'styled-components';

const ContractorHoldMemoJobDetailsWrapper = styled.div`
  width: 100%;
  background: #f5f7fa;
  padding: 30px 40px;
  @media only screen and (max-width: 520px) {
    padding: 30px 15px;
  }

  .cardWrapper {
    border: solid 1px #e8e8f1;
    background-color: #ffffff;
    border-radius: 10px;
  }

  .jobMemoWrapper {
    margin-top: 30px;

    &:first-child {
      margin-top: 0;
    }
    .ant-card .ant-card-body {
      @media only screen and (max-width: 520px) {
        padding: 15px;
      }
    }

    .memoAcceptFormWrapper {
      .leftFields {
        &.left-width .infoDetails {
          width: 100%;
        }
        padding: 20px;
        min-width: calc(100% - 280px);
        flex: 1;
        border-right: solid 1px #e8e8f1;
        @media only screen and (max-width: 1023px) {
          min-width: 100%;
          border-right: none;
        }
        .editor-preview-container{
          background-color: #fafbff;
          padding: 20px;
          // border: 1px solid #d9d9d9;
          border-radius: 5px;
          overflow-y: auto;
          max-height: 450px;
          min-height: 100px;
          p > img, .ql-video {
            width: 100%;
          }
        }

        .optionalMessage {
          margin: 15px 0 0 0;

          label {
            font-size: 13px;
            color: #868698;
            margin-bottom: 5px;
            display: inline-block;
          }
          textarea {
            border-radius: 5px;
            border: solid 1px #bcbccb;
            background-color: #fafbff;
            resize: none;
          }
        }
        .upload-btn-wrapper-outer{
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .uploadBtnWrapper {
          margin-top: 20px;
          margin-bottom: 20px;

          button {
            display: flex;
            align-items: center;
            padding: 16px 39px 16px 40px;
            height: auto;
            border-color: #bcbccb;

            span {
              margin-left: 15px;
            }
            &:hover, &:focus{
                color: #595959 !important; 
            }
          }
        }
      }

      .rightFields {
        padding: 20px;
        flex: 1;
        min-width: 280px;
        @media only screen and (max-width: 520px) {
          min-width: 260px;
        }

        .actionBtnWrapper {
          text-align: center;

          button {
            max-width: 180px;
            min-width: 100px;
            color: #fff;
            border: transparent;
            &.disabled {
              cursor: default;
            }

            &.declineBtn {
              background: #e25656;
              &.disabled {
                background: #e48585;
              }
            }

            &.acceptBtn {
              &.hold {
                background: #51369a;
              }
              &.deal {
                background: #19913d;
                &.disabled {
                  background: #70a580;
                }
              }
            }
          }

          p {
            text-align: right;
            color: #868698;
            font-size: 12px;
            margin-top: 20px;
          }
        }

        .ant-radio-group {
          display: flex;
          flex-direction: column;
          border-bottom: solid 1px #e8e8f1;

          .ant-radio-wrapper {
            padding: 10px;
            margin: 0;
            font-weight: bold;

            .ant-radio {
              position: relative;
              top: 0;
              align-self: center;
            }
          }

          .ant-radio-wrapper-checked {
            background-color: #f0f0f7;
          }

          .ant-radio-inner {
            border-color: #bcbccb;
          }
        }
      }

      input[type='file'] {
        display: none;
      }
    }

    .networkUserWrapper {
      .title {
        font-size: 20px;
        font-weight: bold;
        color: #2f2e50;
        padding: 25px 30px;
        border-bottom: 1px solid #e8e8f1;
      }

      .ant-card-head-title {
        border-bottom: 1px solid #bcbccb;
      }

      .ant-card-body {
        background: #ffffff;
      }
    }

    .paymentWrapper {
      border-bottom: solid 1px #e8e8f1;
      margin-bottom: 20px;

      &:first-child {
        border-top: none;
      }
    }

    .memoAttachmentWrapper {
      margin-top: 20px;
    }
  }
`;

export default ContractorHoldMemoJobDetailsWrapper;
