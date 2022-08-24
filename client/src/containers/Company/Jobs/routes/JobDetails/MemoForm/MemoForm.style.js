import React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import { palette } from 'styled-theme';

const AntModal = (props) => (
  <Modal footer={null} closable={false} maskClosable={false} {...props} />
);

const StyledMemoModal = styled(AntModal)`
  .ant-modal-content {
    border-radius: 10px;
  }

  .ant-modal-body {
    padding: 0;
  }
`;

export const MemoFormWrapper = styled.div`
  .MemoHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d9d9e2;
    padding: 30px;

    .title {
      font-size: 25px;
      font-weight: bold;
      color: ${palette('text', 5)};
    }
  }

  .MemoBody {
    padding: 30px;
    
    .contractorAttachments {
      margin-top: 41px;
      
      .contractorAttachmentsTitle {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #2f2e50;
      }
      
      .attachmentBox {
        border: 1px solid #f0f0f7;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
      }
      
      .noAttachment {
        display: flex;
        flex: 1;
        align-items: center;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px 30px;
        margin-bottom: 20px;
        position: relative;
        border: 1px solid #f0f0f7;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
        
        .noAttachmentTitle {
          font-weight: bold;
          color: #2f2e50;
          font-size: 13px;
          margin-left: 20px;
        }
      }
    }
  }
  .mb-8{
    margin-bottom:8px;
    font-size: 14px;
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
  .fixedFieldWrapper{
    padding:10px 15px !important;
  }

  .MemoForm {
    .locked {
      pointer-events: none;
    }
  }
  .payTermsField {
    display: flex;
    justify-content: flex-start;

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
  }
  .radioLabel_addRate {
    color: #868698;
    font-size: 14px;
    white-space: noWrap;
  }

  .priceTypeOption,
  .rateTypeOption {
    margin-bottom: 6px;
  }

  .fieldLabel {
    color: #868698;
  }

  .helper-text {
    color: #eb5757;
  }

  .topField {
    padding-bottom: 20px;
    border-bottom: 1px solid #d9d9e2;

    .formGroup {
      .ant-radio-wrapper span {
        color: #868698;
      }
      .ant-radio-group {
        @media only screen and (max-width: 767px) {
          display: flex;
          flex: 1;
          flex-direction: column;
        }
        .ant-radio-wrapper {
          @media only screen and (max-width: 767px) {
            margin-bottom: 10px;
          }
        }
      }
    }
  }

  .middleField {
    padding-top: 40px;

    span.radioLabel {
      color: #868698;
    }
  }

  .rateFields {
    padding-bottom: 20px;
    .rateList {
      margin-bottom: 20px;

      .viewRate {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -15px;

        .viewRateCol {
          width: calc(25% - 30px);
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
      color: ${palette('themecolor', 0)};
    }
  }

  .headlineField {
    margin-bottom: 20px;

    .quill {
      background: #fafbff;

      .ql-container {
        min-height: 100px;
        border-radius: 5px 5px 0 0;
        .ql-editor {
          max-height: 450px;
          min-height: 100px;
        }
      }
      .ql-toolbar.ql-snow {
        border-radius: 0 0 5px 5px;
      }
    }
  }
`;

export const MemoAttachmentWrapper = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #b4b4c6;
  display: flex;
  flex-wrap: wrap;

  .attachment {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 17px;
    border: 1px solid #e8e8f1;
    background: #fafafa;
    margin: 0 20px 20px 0;

    &:last-child {
      margin-right: 0;
    }

    .nameAndSize {
      flex: auto;
      overflow: hidden;
      display: flex;
      align-items: center;

      .name {
        font-weight: 600;
        color: #3b86ff;
        max-width: 150px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    button {
      flex: 0 0 20px;
      margin-left: 10px;
    }
  }
`;

export const MemoFormButtonsWrapper = styled.div`
  padding: 15px;
  border-top: 1px solid #d9d9e2;
  input[type='file'] {
    display: none;
  }
  &.b-0{
    border:0 !important;
    padding-bottom: 20px;
    padding-top:0px;
  }
  .action-view {
    @media only screen and (max-width: 767px) {
      justify-content: center;
      margin-top: 20px;
      display: flex;
    }
  }

  button {
    min-width: 150px;
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
`;

export const TotalAmountContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 25px;
  line-height: 34px;
  font-family: OpenSans-Bold;
  color: #2f2e50;
  font-weight: bold;
  padding: 18px 0;

  &.total-amount{
    border-top:0 !important;
    display:flex !important;
    justify-content:start !important;
  }
`;

export default StyledMemoModal;
