import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';
import WithDirection from '@iso/lib/helpers/rtl';

const SecondarySidebarWrapper = styled.div`
  display: none;
  @media only screen and (min-width: 768px) {
    display: block;
  }
  .hide-vertical-menu {
    width: 0;
    min-width: 0 !important;
    max-width: 0 !important;
    flex: 0 0 0 !important;
  }
  .isoSecondarySidebar {
    z-index: 1000;
    background-image: linear-gradient(to bottom,#222229,#3f475b);
    width: 260px;
    height: 100%;
    flex: 0 0 260px;
    border-right: 1px solid #e0e0e0;
    @media only screen and (max-width: 767px) {
      max-width: 58px !important;
      min-width: 58px !important;
      width: 58px !important;
    }

    .isoLogoWrapper {
      height: 80px;
      margin: 0;
      padding: 22px 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      ${borderRadius()};

      .triggerBtn {
        background: transparent;
        border: 0;
        outline: 0;
        position: absolute;
        left: 10px;
        cursor: pointer;

        &:before {
          content: '\f20e';
          font-family: 'Ionicons';
          font-size: 26px;
          color: ${palette('themecolor', 0)};
          line-height: 0;
        }
      }
    }

    &.ant-layout-sider-collapsed {
      .isoLogoWrapper {
        padding: 0;

        h3 {
          a {
            font-size: 27px;
            font-weight: 500;
            letter-spacing: 0;
          }
        }
      }
    }

    .menuWrapper {
      display: flex;
      flex-direction: column;
      padding: 20px;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      @media only screen and (max-width: 767px) {
        padding: 10px;
      }
      > .ant-menu-inline-collapsed {
        width: 60px;
        @media only screen and (max-width: 767px) {
          width: 40px;
        }
      }
      .ant-menu {
        @media only screen and (max-width: 767px) {
          width: 40px;
        }
      }
    }

    .isoDashboardMenu {
      background: transparent;
      border: none;

      a {
        text-decoration: none;
        font-weight: 400;
      }

      .ant-menu-item {
        width: 100%;
        height: 60px;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        margin: 0;
        border-radius: 10px;
        border: none;
        ${transition()};

        &:after {
          border-right: none;
        }

        &:active {
          background-image: linear-gradient(to right,${palette('themebg', 0)},${palette('themebg', 1)});
        }

        &.ant-menu-item-selected,
        &.ant-menu-item-active {
          background-color: transparent;
          background-image: linear-gradient(to right,${palette('themebg', 0)},${palette('themebg', 1)});
        }
      }

      .isoMenuHolder {
        display: flex;
        align-items: center;
        width: 100%;

        i {
          font-size: 19px;
          color: inherit;
          margin: ${(props) =>
    props['data-rtl'] === 'rtl' ? '0 0 0 30px' : '0 30px 0 0'};
          width: 18px;
          ${transition()};
        }

        .menu-icon-svg {
          font-size: 20px;
          line-height: 20px;
          color: inherit;
        }

        .menu-prefix {
          position: absolute;
          left: 25px;
        }

        .menu-suffix {
          position: absolute;
          right: 10px;
          .ant-badge-count{
            background: #000 !important;
          }
        }
      }

      .anticon {
        font-size: 18px;
        margin-right: 30px;
        color: inherit;
        ${transition()};
      }

      .nav-text {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: ${(props) =>
    props['data-rtl'] === 'rtl' ? '0 15px 0 0' : '0 0 0 15px'};
        color: #ffffff;
        font-weight: 400;
        ${transition()};
      }
      .short-list-menu {
        justify-content: center;
        padding: 0;
      }
    }

    .ant-menu-dark .ant-menu-inline.ant-menu-sub {
      background: ${palette('secondary', 5)};
    }

    .ant-menu-submenu-inline,
    .ant-menu-submenu-vertical {
      &.ant-menu-submenu-open {
        > .ant-menu-submenu-title {
          .ant-menu-submenu-arrow {
            transform: translateY(3px);

            &:before {
              transform: rotate(-45deg) translateX(3px);
            }

            &:after {
              transform: rotate(45deg) translateX(-3px);
            }
          }
        }
      }

      > .ant-menu-submenu-title {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 40px;

        > span {
          display: flex;
          align-items: center;
        }

        .ant-menu-submenu-arrow {
          left: ${(props) => (props['data-rtl'] === 'rtl' ? '25px' : 'auto')};
          right: ${(props) => (props['data-rtl'] === 'rtl' ? 'auto' : '25px')};

          &:before,
          &:after {
            width: 8px;
            ${transition()};
          }

          &:before {
            transform: rotate(-45deg) translateY(3px);
          }

          &:after {
            transform: rotate(45deg) translateY(-3px);
          }
        }

        &:hover {
          .ant-menu-submenu-arrow {
            &::before,
            &::after {
              background: #733b4a;
            }
          }
        }
      }

      .ant-menu-inline,
      .ant-menu-submenu-vertical {
        > li:not(.ant-menu-item-group) {
          font-size: 13px;
          font-weight: 400;
          margin: 0;
          color: inherit;
          ${transition()};

          &:hover {
            a {
              color: #733b4a !important;
            }
          }

          &.has-border {
            .ant-menu-sub {
              > li:not(.ant-menu-item-group) {
                &:before {
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  border-left: 1px solid #000;
                  margin-left: -10px;
                  content: '';
                }
              }
            }
          }
        }

        .ant-menu-item-group {
          padding-left: 0;

          .ant-menu-item-group-title {
            padding-left: 100px !important;
          }
          .ant-menu-item-group-list {
            .ant-menu-item {
              padding-left: 125px !important;
            }
          }
        }
      }

      .ant-menu-sub {
        box-shadow: none;
        background-color: transparent !important;
      }
    }

    &.ant-layout-sider-collapsed {
      .nav-text {
        display: none;
      }

      .ant-menu-submenu-inline > {
        .ant-menu-submenu-title:after {
          display: none;
        }
      }

      .ant-menu-submenu-vertical {
        > .ant-menu-submenu-title:after {
          display: none;
        }

        .ant-menu-sub {
          background-color: transparent !important;

          .ant-menu-item {
            height: 35px;
          }
        }
      }
    }
  }
`;

export default WithDirection(SecondarySidebarWrapper);
