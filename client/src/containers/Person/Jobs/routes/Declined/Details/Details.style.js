import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const ContractorDeclinedJobDetailsWrapper = styled.div`
  width: 100%;
  background: #f5f7fa;
  padding: 30px 40px;
  
  .cardWrapper {
    border: solid 1px #e8e8f1;
    background-color: #ffffff;
    border-radius: 10px;
  }
  
  .jobMemoWrapper {
    .memoAcceptFormWrapper {
      .leftFields {
        &.left-width .infoDetails {
          width: 100%;
        }
        padding: 20px;
        border-right: solid 1px #e8e8f1;

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
          margin-top: 15wpx;
          
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
      }
      
      .rightFields {
        padding: 20px;
        
        .actionBtnWrapper {
          text-align: center;
          
          button {
            height: 40px;
            margin: 0 5px;
            color: #fff;
            border: transparent;
            
            &.declineBtn {
              background: #e25656;
            }
            &.acceptBtn {
              background: #bcbccb;
              min-width: 84px;
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
              top: -1px;
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
  }
  
  .jobAttachmentWrapper {
    margin-top: 30px;
  }
`;

export default ContractorDeclinedJobDetailsWrapper;
