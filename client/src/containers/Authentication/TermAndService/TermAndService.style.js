import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const TermAndServiceStyleWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    z-index: 1;
    top: 0;
    left: ${(props) => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
    right: ${(props) => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
  }
  .header-view {
    background-color: #2f2e50;
    width: 100%;
    height: 88px;
    display: flex;
    z-index: 1;
    .header-logo {
      width: 100%;
      display: flex;
      max-width: 1024px;
      margin: auto;
      padding-left: 35px;
      padding-right: 35px;
      align-items: center;
    }
  }

  .isoFormContentWrapper {
    width: 100%;
    max-width: 1024px;
    height: 100%;
    z-index: 10;
    position: relative;
    background-color: #ffffff;
    border-radius: 6px 0 0 6px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-width: 375px;
    padding-left: 30px;
    padding-right: 30px;
    flex-direction: column;
    margin: auto;
    margin-top: 30px;
  }

  .isoFormContent {
    display: flex;
    flex: 1;
    .titlePage {
      text-align: center;
      font-size: 15px;
      color: white;
      text-align: left;
      margin-left: 30px;
      margin-top: 5px;
    }
    @media only screen and (max-width: 767px) {
      width: 100%;
      justify-content: flex-start;
    }
  }
  .content-view {
    display: flex;
    flex: 1;
    flex-direction: row;
    @media only screen and (max-width: 767px) {
      min-width: 767px;
    }

    .category-index {
      width: 250px;
      min-width: 250px;
      border-radius: 10px;
      box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.04);
      border: solid 1px #f0f0f7;
      overflow: hidden;
      margin-right: 15px;
      padding-top: 5px;
      padding-bottom: 5px;
      .ant-menu {
        color: #2f2e50;
        font-size: 13px;
        font-family: 'OpenSans', sans-serif;
      }
      .ant-menu-item {
        overflow: visible;
        overflow: visible;
        white-space: normal;
        height: auto;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 15px !important;
        span {
          line-height: 20px;
        }
      }
      .ant-menu-item-selected {
        background-color: white;
        border-left: 3px solid #f48d3a;
        border-right: none;
        font-weight: bold;
        color: #f48d3a;
      }
      .ant-menu-vertical .ant-menu-item::after,
      .ant-menu-vertical-left .ant-menu-item::after,
      .ant-menu-vertical-right .ant-menu-item::after,
      .ant-menu-inline .ant-menu-item::after {
        border-right: none;
      }
      span.border-line {
        // border-bottom: 1px solid #bcbccb;
        margin-right: 15px;
        position: absolute;
        bottom: -3px;
        left: 15px;
        height: 1px;
        right: 10px;
      }
    }
    .category-content {
      flex: 1;
      border-radius: 10px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
      border: solid 1px #f0f0f7;
      .paragraph {
        font-size: 13px;
        padding: 20px 20px 0 20px;
      }
      .header-padding {
        margin-top: 10px;
      }
      .border-view {
        border-style: dashed;
        border-width: 1px;
        padding: 10px;
      }
      .padding-style {
        padding-left: 20px;
      }
      p.p1 {
        margin: 0px 0px 0px 0px;
        font-family: 'OpenSans', sans-serif;
        font-size: 13px;
      }
      p.p2 {
        margin: 0px 0px 10px 0px;
        font-family: 'OpenSans', sans-serif;
        font-size: 13px;
      }

      li.li1 {
        margin: 10px 0px 0px 0px;
        font-family: 'OpenSans', sans-serif;
        font-size: 13px;
      }

      span.s1 {
        font-family: 'OpenSans', sans-serif;
        font-size: 13px;
      }

      ul.ul1 {
        list-style-type: none;
      }
      .term-title {
        text-align: center;
      }
      table {
        width: 100%;
        margin-bottom: 20px;
        border: 1px solid #e0e0e0;
        .left-column {
          width: 40%;
          background-color: rgb(240, 240, 240);
          border-right: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          padding: 7px 10px;
        }
        .right-column {
          background-color: rgb(240, 240, 240);
          border-bottom: 1px solid #e0e0e0;
          padding: 7px 10px;
        }
        .header-title {
          text-align: center;
        }
        .left-content-column {
          width: 40%;
          border-right: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          padding: 7px 10px;
          text-align: left;
        }
        .right-content-column {
          border-bottom: 1px solid #e0e0e0;
          padding: 7px 10px;
          text-align: left;
        }
      }
    }
  }
  .scroll-view {
    margin-bottom: 20px;
  }
  .up-page {
    position: absolute;
    width: 40px;
    height: 40px;
    right: 35px;
    bottom: 35px;
    z-index: 10;
  }
`;

export default WithDirection(TermAndServiceStyleWrapper);
