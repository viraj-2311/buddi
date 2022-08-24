import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Row } from 'antd';

const ContractorInvoicePreviewWrapper = styled(Row)`
  width: 100%;
  height: 100%;
  margin: 0 !important;

  .invoice-container {
    max-width: 870px;
    margin: 0 auto;
  }

  .invoice-status-and-actions {
    background: white;
    border-left: 1px #e0e0e0;
  }

  .invoice-content-wrapper {
    padding: 46px 44px !important;
  }

  .invoice-content {
    overflow: hidden;
    font-size: 13px;
    border-radius: 5px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    background-color: #ffffff;

    .invoice-content-header {
      color: #ffffff;
      background-color: #000000;
      align-items: center;

      .invoice-content-left {
        padding: 40px 20px 40px 40px;
        background-color: #000000;

        .job-detail {
          margin-top: 5px;
          strong {
            display: inline-block;
            margin-right: 5px;
            min-width: 45px;
          }
          .job-name,
          .job-dates {
            strong {
              min-width: 70px;
            }
          }
        }
      }
      .invoice-content-header-title {
        h2 {
          font-size: 40px;
          color: #fff;
          font-weight: bold;
          line-height: normal;
          margin-bottom: 20px;
        }
      }

      .invoice-content-header-sender {
        padding: 35px 40px 30px 30px;
        background-color: #51369a;

        h3 {
          font-size: 15px;
          margin-bottom: 15px;
          color: #fff;
          font-weight: bold;
        }
      }
    }

    .invoice-content-info {
      color: #2f2e50;

      .invoice-content-info-recipient {
        padding: 25px 40px;
        h3 {
          font-size: 13px;
          font-weight: bold;
          line-height: normal;
        }
        h3,
        p {
          margin-bottom: 10px;
        }
      }

      .invoice-content-info-invoice-data {
        padding: 20px 0 30px 0;
        font-size: 13px;
        .ant-row {
          margin: 8px 0;
          .ant-col-md-10 {
            text-align: right;
          }

          &.amount-due {
            margin-top: 15px;
            margin-bottom: 0px;
            padding: 10px 0px;
            background-color: #f0f0f7;
            border-radius: 5px 0 0 5px;
          }
        }

        span {
          text-align: left;
          padding-left: 17px;
        }
      }
    }

    .invoice-content-notes {
      .invoice-content-notes-text {
        padding: 20px 40px;
        color: #2f2e50;
        background-color: #f0f0f7;
      }

      .invoice-content-notes-amount-due {
        padding: 32px;
        background-color: #5c4da0;
        color: #fff;

        .notes-amount {
          font-size: 26px;
          text-align: center;
        }

        .notes-amount-due-label {
          text-align: center;
        }
      }
    }

    .invoice-preview-footer {
      text-align: center;
      padding: 25px;

      font-size: 9px;
      color: #2f2e50;

      p {
        margin: auto;
      }
    }

    .ant-table {
      width: 100%;
      font-family: 'OpenSans', sans-serif;
      border: none;

      thead {
        padding: 0 9px 10px 38px;
        background-color: #2f2e50;
        th {
          background-color: #2f2e50;
          font-weight: bold;
          width: 20%;
          &:first-child {
            padding-left: 40px;
          }
          &:last-child {
            width: 15%;
          }
        }
      }
      tbody {
        .bordered-row {
          td {
            position: relative;
            border: none;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 1px;
              left: 0;
              bottom: 0;
              background-color: #bcbccb;
            }
            &:first-child {
              &::after {
                width: 80%;
                left: 20%;
              }
            }
            &:last-child {
              &::after {
                width: 80%;
                right: 20%;
              }
            }
          }
        }
        td {
          &:first-child {
            padding-left: 40px;
          }
        }
      }

      .dealMemo {
        thead {
          background-color: #5c4da0;
          th {
            background-color: #5c4da0;
            color: #fff;
          }
        }
      }

      .services {
        margin-top: 26px;
        thead {
          background-color: #2f2e50;
          th {
            background-color: #2f2e50;
            color: #fff;
          }
        }
      }

      .total-amount {
        td {
          width: 20%;
          &:first-child {
            width: 60%;
          }
          &:last-child {
            width: 15%;
          }

          strong,
          span {
            display: block;
            margin-bottom: 8px;
          }
          &.total-calculation {
            padding-left: 30px;
          }
        }
      }

      .receipt,
      .rates {
        margin-top: 26px;
        thead {
          background-color: #f0f0f7;

          th {
            background-color: #f0f0f7;
            color: #2f2e50;
          }
        }
      }
      .rates {
        margin-top: 0px;
      }
    }
  }

  .invoice-status-and-actions {
    .invoice-actions-header {
      padding: 36px 20px;
      font-size: 15px;
      text-align: left;
      color: #2f2e50;
      border-bottom: 1px #e0e0e0 solid;
    }

    .invoice-actions-content {
      padding: 20px;

      .ant-select-selector {
        font-size: 14px;
        text-align: left;
        color: #333333;
      }

      .invoice-status-reason {
        font-size: 14px;

        label {
          color: #333333;
        }

        textarea {
          border-radius: 2px;
          border: solid 1px #bdbdbd;
          background-color: #f2f2f2;
          resize: none;
          min-height: 96px;
        }
      }

      button {
        width: 100%;
      }

      .ant-row {
        margin-bottom: 20px;
      }
    }
  }
  .receipt-attachment-outer{
    margin-top:20px;
    background-color: #f0f0f7;
    border-radius: 4px;
    overflow: hidden;
    .invoice-main-title{
      background: #51369a;
      width: 100%;
      color: #fff;
      padding: 15px;
      font-size: 20px;
    }
    .receipt-inner{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding:15px;
      background: #fff;
      margin: 12px;
      border-radius: 4px;
      .receipt-left-area{
        display: flex;
        align-items: center;
        margin-left:10px;
        p{
          margin-left: 10px;
          &:hover{
            cursor:pointer;
            color:#51369a;
            text-decoration:underline;
          }
        }
      }
      .ant-btn-link{
        font-size:20px;
        padding: 2px 10px;
        cursor:pointer;
      }
    }
  }
`;

export default ContractorInvoicePreviewWrapper;
