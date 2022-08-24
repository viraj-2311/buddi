import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Modal } from 'antd';
import MultiplyIcon from '@iso/components/icons/Multiply';

const AntModal = (props) => (
  <Modal closeIcon={<MultiplyIcon width={16} height={16} />} {...props} />
);

const StyledMemoPreviewModal = styled(AntModal)`
  .ant-modal-close {
    top: 15px;
  }

  .ant-modal-content {
    border-radius: 10px;
  }

  .ant-modal-header {
    border-radius: 10px 10px 0 0;
    padding: 30px;

    .ant-modal-title {
      font-size: 25px;
      color: ${palette('text', 5)};
      font-weight: bold;
    }
  }

  .ant-modal-body {
    padding: 30px;
    background: linear-gradient(to right,#222229,#3f475b) !important;
    color: #43425d;
  }

  .ant-modal-footer {
    padding: 30px;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MemoBodyWrapper = styled.div`
  .logoWrapper {
    text-align: center;
  }

  .memoInfoWrapper {
    width: 100%;
    max-width: 680px;
    margin: 30px auto 20px;
    border: 1px solid #f0f0f7;
    border-radius: 10px;
    background-color: #fff;
    text-align: left;

    .headlineEditorWrapper {
      margin-bottom: 25px;

      .ql-editor {
        font-size: 15px;
        color: #43425d;
        .ql-snow .ql-editor img, .ql-video {
          width: 100%;
        }
      }
    }

    .headlineWrapper {
      margin: 20px 0 15px;
      .editor-preview-container{
        background-color: #fafbff;
        padding: 10px;
        border: 1px solid #d9d9d9;
        border-radius: 5px;
        overflow-y: auto;
        max-height: 450px;
        min-height: 100px;
        p > img, .ql-video {
          width: 100%;
        }
      }

      > div {
        margin-bottom: 15px;
      }
      .emailEditBtn {
        color: #3b86ff;
        span{
          color: #e17f08;
        }
      }
    }
    .emailUpdateBtn{
      margin-top:20px;
      span{
        color: #e17f08;
      }
    }

    > .ant-row {
      margin: 20px 50px;
      border-top: 1px solid #e8e8f1;

      .memoDetail {
        margin-top: 10px;
      }

      .breakSection {
        margin: 20px 0px;
        border-bottom: 1px solid #e8e8f1;
      }
    }

    .title {
      text-align: center;
      font-size: 25px;
      font-weight: bold;
      color: #43425d;
      margin-top: 20px;
    }
  }

  .viewMemoBtnWrapper {
    text-align: center;
    margin-bottom: 10px;
    margin-top: 15px;
  }
`;

export const TotalAmountContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
  font-weight: bold;
  padding-top: 15px;
  margin-top: 20px;
  border-top: 1px solid #d9d9e2;
`;

export default StyledMemoPreviewModal;
