import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const AntModal = props => <Modal {...props} />;

const StyledModal = styled(AntModal)`
  .ant-modal-close {
    top: 25px;
    color: ${palette('text', 5)};
    @media screen and (max-width: 767px) {
      top: 7px;
    }
  } 
  
  .ant-modal-content {
    border-radius: 10px;
  }
  
  .ant-modal-header {
    border-radius: 10px 10px 0 0;
    padding: 25px 55px 25px 35px;
    border-bottom: 1px solid ${palette('border', 11)};
    @media screen and (max-width: 767px) {
      padding: 25px 20px;
    }
    .ant-modal-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;      
      @media screen and (max-width: 767px) {
        display: block;
      }
      .title {
        font-size: 25px;
        color: ${palette('text', 5)};
        font-weight: bold;    
        @media screen and (max-width: 767px) {
          display: block;
          margin-bottom: 20px;
        }
      }
      
      .invoiceTotals {
        display: flex;
        align-items: center;
        @media screen and (max-width: 480px) {
          width: 100%;
          display: block;
        }
        label {
          font-size: 15px;
          font-weight: bold;
          color: ${palette('text', 5)};
          margin-right: 10px;
          flex-shrink: 0;
          @media screen and (max-width: 576px) {
            font-size: 20px;
          }
        }
        
        input {
          pointer-events: none;
          font-size: 20px;
          font-weight: bold;
          color: ${palette('text', 5)}; 
        }
        
        .totalCrew {
          margin-right: 35px;
          display: flex;
          align-items: center;
          @media screen and (max-width: 576px) {
            margin-right: 0;
          }
          input {
            width: 115px;
          }
        }
        
        .totalAmount {
          display: flex;
          align-items: center;
          
          input {
            width: 185px;
          }
        }
        .totalCrew, .totalAmount {
          @media screen and (max-width: 576px) {
            text-align: center;
            input {
              padding: 0;
              border: 0;
              height: auto;
              background: transparent;
            }
          }
        }
      }
    }
  }
  
  .ant-modal-body {
    padding: 16px 32px;
    background: #f5f7fa;
    color: ${palette('text', 5)};
    max-height: calc(100vh - 400px);
    overflow-y: auto;
  }
  
  .ant-modal-footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 30px 35px;
    @media screen and (max-width: 576px) {
      padding: 25px;
    }
    @media screen and (max-width: 480px) {
      flex-direction: column-reverse;
    }
    button {
      margin-left: 15px;
      &.ant-btn {
        @media screen and (max-width: 480px) {
          margin-left: 0;
          margin-bottom: 20px;
          width: 100%;
          display: block;
          &:first-child {
            margin-bottom: 0;
          }
        }
      }
    }    
  }  
`;

const InvoiceRequestContentWrapper = styled.div`
  width: 100%;
  @media screen and (max-width: 992px) {
    width: 900px;
  }
  .invoiceDepartmentList {
    border: 1px solid #e8e8f1;
    border-radius: 10px;
    overflow: hidden;
    @media screen and (max-width: 992px) {
      border-top: 0;
      border-radius: 0;
    }
  }
  
`;

export { InvoiceRequestContentWrapper };

export default StyledModal;