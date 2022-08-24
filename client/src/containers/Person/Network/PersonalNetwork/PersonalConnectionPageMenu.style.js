import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import { palette } from 'styled-theme';
const WDPrivateConnectionPageMenu = styled.div`
  & {
    display: flex;
    background: #ffffff;
    align-items: center;
    padding-left: 40px;
    width: 100%;

    .networkConnectionMenu {
      height: 100%;
      max-width: 65%;
      background: transparent;
      border-bottom: none;
      display: flex;
      align-items: center;

      @media (max-width: 768px) {
        max-width: 100%;
      }

      .ant-menu-item {
        text-align: center;
        flex: auto;
        min-width: 60px;
        border-bottom: none;

        &:nth-child(2) {
          flex: none;
          margin-left: 0;
        }

        &.ant-menu-item:hover::after {
          display: none !important;
        }

        a {
          border-bottom: solid 4px transparent;
          display: inline-block;
          padding: 0 10px 1px;
          cursor: pointer;
          &:hover {
            border-bottom: 4px solid ${palette('themecolor', 0)} !important;
            color: ${palette('themecolor', 0)} !important;
            border-bottom-color: ${palette('themecolor', 0)};
          }
        }

        &.ant-menu-item:hover {
          color: ${palette('themecolor', 0)} !important;
          border-bottom: none;
        }

        &.ant-menu-item-selected {
          border-bottom: none;

          a {
            font-weight: bold;
            border-bottom: 4px solid #f48d3a !important;
            color: ${palette('themecolor', 0)} !important;
            border-bottom-color: ${palette('themecolor', 0)};
          }
        }
      }
    }
  }
`;

const PrivateConnectionPageMenu = WithDirection(WDPrivateConnectionPageMenu);

export default PrivateConnectionPageMenu;
