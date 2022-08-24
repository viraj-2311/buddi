import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDPageMenu = styled.div`
  & {
    display: flex;
    align-items: center;
    padding-left: 25px;
    width: 100%;
    background-color: #fff;

    .jobPageMenu {
      height: 100%;
      max-width: 65%;
      background: transparent;
      border-bottom: none;
      display: flex;
      align-items: center;
      padding-left: 12px;

      .ant-menu-item {
        text-align: center;
        flex: auto;
        min-width: 60px;
        border-bottom: none;

        &:nth-child(2) {
          flex: none;
          margin-left: 0;
        }

        a {
          border-bottom: solid 4px transparent;
          display: inline-block;
          padding: 0 10px 1px;
          &:hover {
            color: #2f2e50;
            border-bottom-color: ${props => props.activeColor};
          }
        }

        &.ant-menu-item:hover {
          color: #2f2e50;
          border-bottom: none;
        }

        &.ant-menu-item-selected {
          border-bottom: none;
          
          a {
            font-weight: bold;
            color: #2f2e50;
            border-bottom-color: ${props => props.activeColor};
          }
        }
      }
    }
  }
`;

const PageMenu = WithDirection(WDPageMenu);

export default PageMenu;
