import styled from 'styled-components';
import { transition } from '@iso/lib/helpers/style_utils';

const HistoryWrapper = styled.div`
  margin: 0;
  height: 100%;
  width: 100%;
  background-color: #f5f7fa;

  .loading-view {
    flex: 1;
    align-items: center;
    justify-content: center;
    align-content: center;
    display: flex;
    height: 100%;
  }
  .content-title {
    font-size: 25px;
    font-weight: bold;
    margin: 40px;
    margin-bottom: 0;
    padding: 15px 30px 15px 30px;
    border-bottom: 1px solid #f5f7fa;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: white;
    @media only screen and (max-width: 520px) {
      margin: 40px 15px 0 15px;
    }
  }
  .content {
    margin: 40px;
    color: #2f2e50;
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    background-color: #fff;
    padding: 30px;
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    @media only screen and (max-width: 520px) {
      margin: 0 15px 40px 15px;
      padding: 30px 15px 30px 15px;
    }

    .datetime-wrapper {
      display: flex;
      @media only screen and (max-width: 767px) {
        flex-wrap: wrap;
      }

      .fake-input-container {
        height: 50px;
        text-align: center;
        padding-top: 14px;
        background-color: #fafbff;
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
        ${transition()};
        @media only screen and (max-width: 767px) {
          display: none;
        }
      }
      .fake-label {
        visibility: hidden;
      }

      .ant-picker {
        &.datetime-from {
          min-width: 140px;
          @media only screen and (min-width: 768px) {
            border-right: none;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }

        &.datetime-to {
          min-width: 140px;
          @media only screen and (min-width: 768px) {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }

      &:hover,
      &:focus {
        .ant-picker,
        .fake-input-container {
          border-color: #d9d9d9;
          box-shadow: none;
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
    .filtering {
      display: flex;
      grid-gap: 10px;
      flex-wrap: wrap;
      min-width: 450px;
      margin-bottom: 30px;
      @media only screen and (max-width: 767px) {
        width: 320px;
      }
      @media only screen and (min-width: 1400px) {
        justify-content: flex-end;
      }
    }

    .filter-style {
      width: 200px;
      @media only screen and (max-width: 767px) {
        width: 320px;
      }
    }

    .search-container-wrapper {
      text-align: left;
      min-width: 150px;
      max-width: 320px;
      @media only screen and (max-width: 767px) {
        width: 100%;
      }

      .fake-label {
        visibility: hidden;

        @media only screen and (max-width: 767px) {
          display: none;
        }
      }
    }
    .button-area {
      grid-gap: 20px;
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
    .buttonWrap {
      background-image: linear-gradient(to right, #6e52fc, #52a0f8);
      min-width: 130px;
      @media only screen and (max-width: 767px) {
        margin-top: 15px;
      }
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

  .ant-collapse-item {
    .ant-collapse-header {
      border-left: solid 5px transparent;
    }

    .ant-collapse-content {
      border-left: solid 5px transparent;
    }
  }

  .ant-collapse-item-active {
    .ant-collapse-header {
      border-left: solid 5px #f48d3a;
      border-top: solid 1px #b4b4c6;
      border-right: solid 1px #b4b4c6;
    }

    .ant-collapse-content {
      border-left: solid 5px #808bff;
      border-right: solid 1px #b4b4c6;
      border-bottom: solid 1px #b4b4c6;
    }
  }

  .panel-header {
    color: #2f2e50;
    flex: 1;

    .ant-btn {
      background: #f48d3a;
      width: 56px;
      height: 56px;
    }
    .header-icon-view {
      display: flex;
      justify-content: center;
    }

    .panel-header-container {
      display: flex;
      align-items: center;
    }

    .panel-header-content {
      min-height: 90px;
      padding-top: 20px;
      padding-bottom: 20px;
      padding-left: 5px;
      border-bottom: dotted 1px #b4b4c6;
    }

    .event {
      font-size: 15px;
      font-weight: bold;
      overflow-wrap: anywhere;
    }

    .date,
    .description {
      font-size: 13px;
    }

    .total-money {
      font-size: 20px;
      font-weight: bold;
      text-align: right;
    }

    .positive {
      color: #19913d;
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

    .total-money {
      font-size: 20px;
      font-weight: bold;
      text-align: right;
    }

    .money {
      font-size: 15px;
      text-align: right;
    }
  }
  .paging-history {
    justify-content: flex-end;
    display: flex;
    margin-top: 20px;
    margin-right: 10px;
  }
  .pending {
    color: #ffa177;
  }
`;

export default HistoryWrapper;
