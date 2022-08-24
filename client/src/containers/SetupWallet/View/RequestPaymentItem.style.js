import styled from 'styled-components';
import { transition } from '@iso/lib/helpers/style_utils';

const RequestPaymentItemWrapper = styled.div`
  .content {
    margin-bottom: 20px;
    color: #2f2e50;
    background-color: #43425d;

    .datetime-wrapper {
      display: flex;

      .fake-input-container {
        height: 50px;
        text-align: center;
        padding-top: 14px;
        background-color: #fafbff;
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
        ${transition()};
      }
      .fake-label {
        visibility: hidden;
      }

      .ant-picker {
        &.datetime-from {
          border-right: none;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        &.datetime-to {
          border-left: none;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }

    .content-text {
      text-align: center;
      font-size: 15px;
      font-weight: bold;
      color: #2f2e50;
    }

    .content-bottom-text {
      font-size: 15px;
    }

    .search-container-wrapper {
      text-align: right;

      .fake-label {
        visibility: hidden;

        @media only screen and (max-width: 767px) {
          display: none;
        }
      }
    }

    .search-container {
      max-width: 300px;
      display: inline-block;

      @media only screen and (max-width: 767px) {
        max-width: 767px;
        display: block;
      }
    }

    .content-status {
      font-size: 20px;
      font-weight: bold;
      margin-top: 30px;
      margin-bottom: 20px;
    }

    .content-date {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }

  .ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header {
    padding-top: 0;
    padding-right: 14px;
    padding-bottom: 0;
    padding-left: 0;

    @media only screen and (max-width: 767px) {
      padding-left: 5px;
    }
  }

  .ant-collapse-content > .ant-collapse-content-box {
    @media only screen and (max-width: 767px) {
      padding-left: 5px;
    }
  }

  .ant-collapse
    > .ant-collapse-item
    > .ant-collapse-header
    .ant-collapse-arrow {
    top: 60%;
  }
  .ant-collapse-borderless {
    background-color: transparent;
  }

  .ant-collapse-borderless > .ant-collapse-item {
    border: none;
  }

  .panel-header {
    color: #2f2e50;
    padding: 20px 20px;
    flex: 1;
    display: flex;
    align-items: flex-start;

    .ant-btn {
      background: #51369a;
      width: 56px;
      height: 56px;
    }
    .header-icon-view {
      display: flex;
      justify-content: center;
      margin-top: 3px;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background-color: #f48d3a;
      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
      }
    }

    .panel-header-container {
      display: flex;
      align-items: center;
    }

    .panel-header-content {
      flex: 1;
      display: flex;
      width: calc(100% - 150px);
      .user-info {
        flex: 1;
        margin-left: 15px;
        overflow-wrap: break-word;
        width: calc(100% - 10px);
      }
    }

    .event {
      font-size: 15px;
      font-weight: bold;
      color: white;
    }

    .date,
    .description {
      font-size: 13px;
      color: white;
      width: 100%;
      overflow-wrap: anywhere;
    }

    .rejected {
      color: #d9363e;
      font-size: 13px;
      padding: 0;
      display: contents;
    }
    .completed {
      color: #00b16a;
      font-size: 13px;
      padding: 0;
      display: contents;
    }

    .total-money {
      font-weight: bold;
      text-align: right;
      align-items: center;
      display: flex;
      flex-direction: column;
      color: white;
      span {
        padding: 0;
        display: inline;
      }
    }

    .positive {
      color: #19913d;
    }

    .disableButton {
      opacity: 0.5;
    }

    .paynow-button {
      min-width: 80px;
      height: 30px;
      background-image: linear-gradient(to right, #6e52fc, #52a0f8);
      border: none;
      margin-top: 7px;
      padding: inherit;
      span {
        font-size: 13px;
      }
    }
  }

  .panel-content {
    .content-header {
      font-size: 15px;
      font-weight: bold;
      line-height: 35px;
    }

    .panel-content-content {
      margin-top: 20px;
    }

    .detail,
    .transfer-id {
      margin-top: 20px;
    }

    .panel-content-bottom {
      margin-top: 20px;

      .action {
        padding-top: 20px;
        padding-bottom: 20px;
      }

      .summary {
        padding-top: 20px;
        padding-bottom: 20px;
        border-top: 1px solid #b4b4c6;
      }
    }

    .content-value {
      font-size: 15px;
    }

    .money {
      font-size: 15px;
      text-align: right;
    }
  }
`;

export default RequestPaymentItemWrapper;
