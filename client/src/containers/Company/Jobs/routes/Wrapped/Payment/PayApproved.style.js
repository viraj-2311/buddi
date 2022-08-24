import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const AntModal = (props) => <Modal {...props} />;

const StyledModal = styled(AntModal)`
  &.ant-modal {
    width: calc(100% - 60px) !important;
    max-width: 1000px;
    padding-bottom: 0;
    border-radius: 10px;
    overflow: hidden;
    @media (max-width: 425px) {
      width: calc(100% - 40px) !important;
    }
  }
  .ant-modal-close {
    top: 25px;
    color: ${palette('text', 5)};
    @media (max-width: 575px) {
      top:10px
    }
  }

  .ant-modal-header {
    border-radius: 10px 10px 0 0;
    padding: 25px 55px 25px 35px;
    border-bottom: 1px solid ${palette('border', 11)};
    @media (max-width: 360px) {
      padding: 20px;
    }

    .ant-modal-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media (max-width: 992px) {
        flex-wrap: wrap;
      }

      .header-view {
        display: flex;
        flex-direction: row;
      }

      .title {
        font-size: 25px;
        color: ${palette('text', 5)};
        font-weight: bold;
        line-height: 30px;
        @media (max-width: 575px) {
          font-size:20px;
        }
      }

      .invoiceTotals {
        display: flex;
        align-items: center;
        @media (max-width: 575px) {
          flex-wrap: wrap;
        }
        @media (max-width: 889px) {
          margin-top:20px;
        }

        label {
          font-size: 15px;
          font-weight: bold;
          color: ${palette('text', 5)};
          margin-right: 10px;
          flex-shrink: 0;
        }

        input {
          pointer-events: none;
          font-size: 20px;
          font-weight: bold;
          color: ${palette('text', 5)};
          @media (max-width: 360px) {
            font-size: 16px;
            width:100% !important;
          }
        }

        .totalCrew {
          margin-right: 35px;
          display: flex;
          align-items: center;
          @media (max-width: 767px) {
            width: 100%;
            margin-top: 20px;
          }

          input {
            width: 115px;
          }
        }

        .totalAmount {
          display: flex;
          align-items: center;
          @media (max-width: 767px) {
            width: 100%;
            margin-top: 20px;
          }

          input {
            width: 185px;
          }
        }
      }
    }
  }

  .ant-modal-body {
    padding: 40px ​50px;
    background: #f5f7fa;
    color: ${palette('text', 5)};
    min-height: 300px;
    overflow-y: auto;
    .ant-menu-submenu-title{
      height:60px !important;
      font-size: 14px;
    }
    .table-global {
      {
        thead{
          tr{
            th {
              text-align: left !important;
              font-size: 14px;
            }
          }
        }
        tbody{
          tr{
            td{
              text-align: left !important;
              font-size: 14px;
              padding-left: 10px !important;
            }
          }
        }
      }
    }
  }

  .ant-modal-footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 30px 35px;
    @media (max-width: 575px) {
      flex-wrap: wrap-reverse;
      padding: 20px;
    }
    @media (max-width: 574px) {
      button{
        width: 100% !important;
        margin: 0 !important;
      }
    }
    .button-approval {
      @media (max-width: 767px) {
        width: 100%;
      }
    }

    button {
      margin-left: 15px;

      &.cancelBtn {
        width: 150px;
      }
      &.payApprovedBtn {
        background-color: #19913d;
        border-color: #19913d;
        color: #ffffff;
        margin: 0 20px;
        width: 260px;
        &:hover,
        &:focus {
          background-color: #19913d;
          border-color: #19913d;
        }
        @media (max-width: 575px) {
           margin-bottom: 20px !important;
        }
      }
    }
  }
`;

const PayApprovedContentWrapper = styled.div`
  width: 100%;

  .payDepartmentList {
    border: 1px solid #e8e8f1;
    border-radius: 10px;
    overflow: hidden;
    .inner-scroll {
      overflow-x: auto;
    }
  }
`;

export { PayApprovedContentWrapper };

export default StyledModal;
