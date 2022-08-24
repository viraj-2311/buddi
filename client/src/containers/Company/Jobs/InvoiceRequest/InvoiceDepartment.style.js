import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceDepartmentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;

  .departmentListWrapper {
    width: 300px;
    flex-shrink: 0;

    .departmentName {
      margin-left: 20px;
      vertical-align: middle;
    }

    .positionName {
      margin-left: 20px;
      vertical-align: middle;
    }
  }

  .invoiceDepartmentTable {
    display: block;
    width: 100%;
    .table-global {
      thead, tbody {
        tr {
          th, td {
            &:nth-child(1) {
              width: 150px;
              max-width: 150px;
            }
            &:nth-child(2), &:nth-child(3) {
              width: 100px;
            }
          }
        }
      }
    }
  }

  .userInfo {
    a{
      color: ${palette('themecolor', 0)} !important;
    }
  }

  .departmentList {
    background: none;

    .departmentPositionList {
      > .ant-menu-submenu-title {
        height: auto;
        background: #ffffff;
        padding: 20px !important;
        line-height: 15px;
        font-weight: bold;
        color: ${palette('text', 5)};
        border-bottom: 1px solid #e8e8f1;
        margin: 0;
      }

      > .ant-menu {
        background: none;
        margin: 0;
      }

      .ant-menu-sub {
        > .ant-menu-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 20px !important;
          background: none;
          margin: 4px 0;
        }
      }
    }
  }

  .crewListWrapper {
    flex: auto;
  }

  .crewList {
    color: ${palette('text', 5)};

    .crewListHead {
      .crewHeadRow {
        border-bottom: 1px solid #e8e8f1;
        background: #ffffff;

        .crewHeadTitle {
          padding: 20px;
          line-height: 18px;
          font-size: 15px;
          font-weight: bold;
        }
      }
    }

    .crewListBody {
      margin: 25px 0;
      padding-left: 20px;
      &::before {
        display: table;
        content: '';
      }

      .crewBodyRow {
        margin: 4px 0;
        height: 40px;

        .crewBodyData {
          margin: 0;
          padding: 0 20px;
          display: flex;
          align-items: center;

          &.groupData {
            background-color: #ffffff;
            border-top: solid 1px #e0e1e9;
            border-bottom: solid 1px #e0e1e9;

            &.groupData.first {
              border-radius: 5px 0 0 5px;
              border-left: solid 1px #e0e1e9;
            }

            &.groupData.last {
              border-radius: 0 5px 5px 0;
              border-right: solid 1px #e0e1e9;
            }
          }
        }
      }
    }
  }

  .boldText {
    font-weight: bold;
  }

  .textCenter {
    text-align: center;
  }
`;

export default InvoiceDepartmentWrapper;
