import styled from 'styled-components';
import { palette } from 'styled-theme';
import {
  transition,
  borderRadius,
  boxShadow,
} from '@iso/lib/helpers/style_utils';
import WithDirection from '@iso/lib/helpers/rtl';

const TopbarWrapper = styled.div`
  .isomorphicTopbar {
    position: relative !important;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    z-index: 1000;
    ${transition()};
    height: auto !important;
    min-height: 88px;
    padding-right: 40px;

    /* @media only screen and (max-width: 767px) {
      padding: ${(props) =>
    props['data-rtl'] === 'rtl'
      ? '0px 260px 0px 15px !important'
      : '0px 15px 0px 260px !important'};
    } */

    &.collapsed {
      padding: ${(props) =>
    props['data-rtl'] === 'rtl' ? '0 109px 0 31px' : '0 31px 0 109px'};
      @media only screen and (max-width: 767px) {
        padding: ${(props) =>
    props['data-rtl'] === 'rtl'
      ? '0px 15px !important'
      : '0px 15px !important'};
      }
    }

    .isoLeft {
      display: flex;
      align-items: center;
      &.hamburger {
        display: none;
        @media only screen and (max-width: 767px) {
          display: flex;
        }
      }
      @media only screen and (max-width: 767px) {
        margin: ${(props) =>
    props['data-rtl'] === 'rtl' ? '0 0 0 20px' : '0 20px 0 0'};
      }

      .isoSearch {
        margin-left: 25px;
        cursor: pointer;
        font-size: 24px;
        display: inline-block;

        .searchBoxWrapper {
          display: flex;
          align-items: center;

          input {
            border: none;
            outline: none;
            font-size: 15px;
            margin-left: 10px;
          }
        }
      }
    }

    .isoRight {
      display: flex;
      align-items: center;
      flex: 1;
      flex-wrap: wrap-reverse;
      justify-content: flex-end;
      @media only screen and (max-width: 425px) {
        margin-top: 15px;
        margin-bottom: 15px;
      }

      li {
        margin-left: ${(props) => (props['data-rtl'] === 'rtl' ? '20px' : '0')};
        margin-right: ${(props) =>
    props['data-rtl'] === 'rtl' ? '0' : '20px'};
        cursor: pointer;
        line-height: normal;
        position: relative;
        display: inline-block;

        @media only screen and (max-width: 375px) {
          margin-left: ${(props) =>
    props['data-rtl'] === 'rtl' ? '25px' : '0'};
          margin-right: ${(props) =>
    props['data-rtl'] === 'rtl' ? '0' : '25px'};
        }
        @media only screen and (max-width: 425px) {
          margin-right: 10px;
          justify-content: flex-end;
          display: flex;
        }

        &:last-child {
          margin: 0;
        }

        i {
          font-size: 24px;
          color: ${palette('text', 0)};
          line-height: 1;
        }

        .isoIconWrapper {
          position: relative;
          line-height: normal;
          background-color: ${palette('grayscale', 4)};
          border-radius: 50%;
          height: 42px;
          width: 42px;
          padding: 13px 11px 13px 11px;
          img {
            width: 20px;
            height: 16px;
          }

          span {
            font-size: 12px;
            color: #fff;
            background-color: ${palette('secondary', 1)};
            width: 20px;
            height: 20px;
            display: -webkit-inline-flex;
            display: -ms-inline-flex;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 20px;
            position: absolute;
            top: -8px;
            left: ${(props) =>
    props['data-rtl'] === 'rtl' ? 'inherit' : '10px'};
            right: ${(props) =>
    props['data-rtl'] === 'rtl' ? '10px' : 'inherit'};
            ${borderRadius('50%')};
          }
        }

        &.isoWalletButton {
          .walletButton {
            min-width: 203px;
            height: 42px;
            padding: 0;
            text-align: left;
            background-color: #000000;
            border-color: transparent;
            border-radius: 10px;
            color: #ffffff;
            @media only screen and (max-width: 767px) {
              min-width: 150px;
              margin-left: 10px;
            }

            .anticon-loading {
              margin: 0 0 0 10px;
            }

            .walletButtonIcon {
              font-size: 15px;
              padding: 7px 7px 4px;
              margin: 6px 10px 7px 7px;
              border-radius: 30%;
              background-color: ${palette('themecolor', 0)};
              
            }
            .icon-pending {
              background-color: rgba(247, 180, 146);
            }
            .icon-failed {
              background-color: rgba(244, 131, 132);
            }
            .icon-success {
              background-color: rgba(71, 167, 100);
            }
            .walletButtonLabel {
              margin: 1px 7px 0 0;
              font-size: 13px;
              text-align: center;
              font-weight: normal;
              vertical-align: text-top;
              .amount-balance {
                font-weight: bold;
                margin-left: 3px;
              }
            }

            span {
              margin: 0px;
            }
          }
        }
        .pending {
          background-color: #ffa177 !important;
        }
        .failed {
          background-color: #ff6565 !important;
        }
        .success {
          background-color: #19913d !important;
        }

        &.isoMail {
          .isoIconWrapper {
          }
        }

        &.isoNotify {
          margin-right: 30px;
          .isoIconWrapper {
          }
        }

        &.isoMsg {
          .isoIconWrapper {
            span {
              background-color: ${palette('color', 1)};
            }
          }
        }

        &.isoCart {
          .isoIconWrapper {
            span {
              background-color: ${palette('color', 2)};
            }
          }
        }

        &.isoUser {
          .isoImgWrapper {
            width: auto;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            ${borderRadius('50%')};

            .userName {
              font-size: 15px;
              display: flex;
              align-items: center;
              line-height: 1.67;

              .userNameLabel {
                color: #43425d;
                font-size: 15px;
                margin-right: 10px;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.67;
                letter-spacing: normal;
                text-align: right;
                color: #43425d;
              }

              .downOutLinedIcon {
                width: 11px;
                height: 7px;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }

  .isoUserDropdown {
    .ant-popover-inner {
      .ant-popover-inner-content {
        .isoUserDropdownContent {
          padding: 7px 0;
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          right: 0;
          background-color: #ffffff;
          width: 220px;
          min-width: 160px;
          flex-shrink: 0;
          ${borderRadius('5px')};
          ${boxShadow('0 2px 10px rgba(0,0,0,0.2)')};
          ${transition()};

          .isoDropdownLink {
            font-size: 13px;
            color: ${palette('text', 1)};
            line-height: 1.1;
            padding: 7px 15px;
            background-color: transparent;
            text-decoration: none;
            display: flex;
            justify-content: flex-start;
            ${transition()};

            &:hover {
              background-color: ${palette('secondary', 6)};
            }
          }
        }
      }
    }
  }

  // Dropdown
  .ant-popover {
    .ant-popover-inner {
      .ant-popover-inner-content {
        .isoDropdownContent {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          right: 0;
          background-color: #ffffff;
          width: 360px;
          min-width: 160px;
          flex-shrink: 0;
          ${borderRadius('5px')};
          ${boxShadow('0 2px 10px rgba(0,0,0,0.2)')};
          ${transition()};

          @media only screen and (max-width: 767px) {
            width: 310px;
          }

          .isoDropdownHeader {
            border-bottom: 1px solid #f1f1f1;
            margin-bottom: 0px;
            padding: 15px 30px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            h3 {
              font-size: 14px;
              font-weight: 500;
              color: ${palette('text', 0)};
              text-align: center;
              text-transform: uppercase;
              margin: 0;
            }
          }

          .isoDropdownBody {
            width: 100%;
            height: 300px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            background-color: ${palette('grayscale', 6)};

            .isoDropdownListItem {
              padding: 15px 30px;
              flex-shrink: 0;
              text-decoration: none;
              display: flex;
              flex-direction: column;
              text-decoration: none;
              width: 100%;
              ${transition()};

              &:hover {
                background-color: ${palette('grayscale', 3)};
              }

              .isoListHead {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
              }

              h5 {
                font-size: 13px;
                font-weight: 500;
                color: ${palette('text', 0)};
                margin-top: 0;
              }

              p {
                font-size: 12px;
                font-weight: 400;
                color: ${palette('text', 2)};
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              .isoDate {
                font-size: 11px;
                color: ${palette('grayscale', 1)};
                flex-shrink: 0;
              }
            }
          }

          .isoViewAllBtn {
            font-size: 13px;
            font-weight: 500;
            color: ${palette('text', 2)};
            padding: 10px 15px 20px;
            display: flex;
            text-decoration: none;
            align-items: center;
            justify-content: center;
            text-align: center;
            ${transition()};

            &:hover {
              color: ${palette('primary', 0)};
            }
          }

          .isoDropdownFooterLinks {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 30px 20px;

            a {
              font-size: 13px;
              font-weight: 500;
              color: ${palette('text', 0)};
              text-decoration: none;
              padding: 10px 20px;
              line-height: 1;
              border: 1px solid ${palette('border', 1)};
              display: flex;
              align-items: center;
              justify-content: center;
              ${transition()};

              &:hover {
                background-color: ${palette('primary', 0)};
                border-color: ${palette('primary', 0)};
                color: #ffffff;
              }
            }

            h3 {
              font-size: 14px;
              font-weight: 500;
              color: ${palette('text', 0)};
              line-height: 1.3;
            }
          }

          &.withImg {
            .isoDropdownListItem {
              display: flex;
              flex-direction: row;

              .isoImgWrapper {
                width: 35px;
                height: 35px;
                overflow: hidden;
                margin-right: 15px;
                display: -webkit-inline-flex;
                display: -ms-inline-flex;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                background-color: ${palette('grayscale', 9)};
                ${borderRadius('50%')};

                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }

              .isoListContent {
                width: 100%;
                display: flex;
                flex-direction: column;

                .isoListHead {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                }

                h5 {
                  margin-bottom: 0;
                  padding-right: 15px;
                }

                .isoDate {
                  font-size: 11px;
                  color: ${palette('grayscale', 1)};
                  flex-shrink: 0;
                }

                p {
                  white-space: normal;
                  line-height: 1.5;
                }
              }
            }
          }
        }
      }
    }

    &.topbarMail {
      .ant-popover-inner {
        .ant-popover-inner-content {
          .isoDropdownContent {
            @media only screen and (max-width: 519px) {
              right: -170px;
            }
          }
        }
      }
    }

    &.topbarMessage {
      .ant-popover-inner {
        .ant-popover-inner-content {
          .isoDropdownContent {
            @media only screen and (max-width: 500px) {
              right: -69px;
            }
          }
        }
      }
    }

    &.topbarNotification {
      .ant-popover-inner {
        .ant-popover-inner-content {
          .isoDropdownContent {
            @media only screen and (max-width: 500px) {
              right: -120px;
            }
          }
        }
      }
    }

    &.topbarAddtoCart {
      .ant-popover-inner {
        .ant-popover-inner-content {
          .isoDropdownContent {
            @media only screen and (max-width: 465px) {
              right: -55px;
            }

            .isoDropdownHeader {
              margin-bottom: 0;
            }

            .isoDropdownBody {
              background-color: ${palette('grayscale', 6)};
            }
          }
        }
      }
    }
  }
`;

export default WithDirection(TopbarWrapper);
