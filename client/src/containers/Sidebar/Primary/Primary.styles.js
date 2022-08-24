import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const PrimarySidebarWrapper = styled.div`
  display: none;
  @media only screen and (min-width: 768px) {
    display: block;
  }
  .isoPrimarySidebar {
    background-image: linear-gradient(to bottom,${palette('background', 2)},${palette('background', 6)});
    width: 58px;
    height: 100%;
    flex: 0 0 58px;
    z-index: 1000;

    .isoCompanyMenu {
      padding: 0;
      background: transparent;
      border: none;
      padding: 22px 0 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      .ant-menu-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0 0 28px 0;
        background-color: transparent;
        height: 45px;
        width: 45px;

        &:after {
          border-right: none;
        }

        &.ant-menu-item-selected {
          .user-avatar {
            color: ${palette('white', 0)};
          }
        }
      }

      .isoCompanyLogoWrapper,
      .isoPersonalPhotoWrapper {
        border-radius: 5px;
        padding: 3px;
        display: flex;
        justify-content: center;

        .companyTitle {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: ${palette('themecolor', 0)};
          font-weight: bold;
        }
      }
    }

    .addCompanyBtnWrapper {
      text-align: center;

      .companyAddBtn {
        width: 35px;
        height: 35px;
        color: ${palette('themecolor', 0)};

        .anticon {
          margin: 0;
          font-size: 16px;
        }
      }
    }
    .triggerBtn {
      background: transparent;
      border: 0;
      outline: 0;
      width: 100%;
      margin-top: 25px;
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
`;

const CompanyPlusMenuWrapper = styled.div`
  margin: -12px -16px;

  &.isoCompanyPlusDropdown {
    padding: 12px 8px;
    display: flex;
    flex-direction: column;

    .isoDropdownLink {
      padding: 8px 12px;
      background: transparent;
      text-decoration: none;
      color: ${palette('text', 5)};

      &:hover {
        background: #f5f7fa;
      }
    }
  }
`;

export { CompanyPlusMenuWrapper };

export default WithDirection(PrimarySidebarWrapper);
