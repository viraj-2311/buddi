import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceDepartmentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border: 1px solid #e8e8f1;
  border-radius: 10px;
  overflow: hidden;

  .info-tooltip{
    display: inline-block;
    background: red;
    width: 20px;
    height: 20px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    border-radius: 50%;
    margin-left: 5px;
    font-weight: 900;
   }
  }

  .left-table {
    width: 100%;
    .selection-col {
      width: 100%;
    }
    .detail-col {
      width: 100%;
    }
    .invoiceDepartmentTable {
      width: calc(100% - ${(props) => props.leftContentWidth});
      display: block;
      @media (min-width: 1899px) {
        width: calc(100% - 300px);
      }

      .table-global {
        thead tr {
          height: 59px;
        }
        thead tr th {
          background-color: #fff;
          padding: 20px 10px;
          font-size: 11px;
          white-space: nowrap;
          &:first-child {
            min-width: 110px;
            width: 110px;
            
            @media (min-width: 1799px) {
              min-width: 200px;
              width: 200px;
            }
            @media (min-width: 1899px) {
              min-width: 250px;
              width: 250px;
            }
          }
          &:nth-last-child(2),
          &:nth-last-child(3){
            width: 150px;
            min-width: 150px;
          }
          &:last-child {
            width: 125px;
            min-width: 125px;
          }
        }
        tr {
          .action-btn {
            span{
                margin-right: 18px;
            }
            a {
                margin-left: 14px;
             
            }
          }
        }
        tbody tr {
          height: 40px;
        }
        tbody tr td {
          height: 60px;
          padding: 0;
          text-align: center;
        }
        tbody .padding-view {
          height: 10px;
        }
      }
    }
  }
  .departmentListWrapper {
    width: 300px !important;
    flex-shrink: 0;
    // @media (min-width: 1899px) {
    //   width: 375px !important;
    // }
    .departmentList {
      background: none;

      .departmentPositionList {
        > .ant-menu-submenu-title {
          background: #ffffff;
          line-height: 15px;
          font-weight: bold;
          color: ${palette('text', 5)};
          height: 59px;
          padding-left: 15px !important;
          margin: 0;
          border-right: 1px solid #e8e8f1;
          border-bottom: 1px solid #e8e8f1;
          align-items: center;
          display: flex;
          @media (min-width: 1799px) {
            height: 64px;
          }
        }

        > .ant-menu {
          background: none;
          padding-top: 10px;
          padding-bottom: 10px;
        }

        .ant-menu-sub {
          > .ant-menu-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 0 20px !important;
            padding-right: 5px;
            overflow: hidden;
            height: 60px;
            margin: 0;
          }
        }
      }
    }

    .departmentName {
      margin: 0 15px;
      vertical-align: middle;
      font-size: 11px;
      @media (min-width: 1799px) {
        font-size:15px;
      }
    }

    .positionName {
      vertical-align: middle;
      white-space: normal;
      line-height: normal;
      margin-left: 5px;
      font-size:11px;
      @media (min-width: 1799px) {
        font-size:15px;
        margin-left: 15px;
      }
    }
  }

  .crewListWrapper {
    width: calc(100% - 240px);
    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  .crewList {
    color: ${palette('text', 5)};

    .crewListHead {
      .crewHeadRow {
        padding-left: 20px;
        border-bottom: 1px solid #e8e8f1;
        background: #ffffff;

        .crewHeadTitle {
          padding: 20px 10px;
          line-height: 18px;
          font-size: 11px;
          font-weight: bold;
          min-width: 106px;
          @media (max-width: 600px) {
            min-width: 180px;
          }
        }
      }
    }

    .crewListBody {
      margin: 25px 0;
      padding-left: 20px;
      padding-right: 20px;
      &::before {
        display: table;
        content: '';
      }

      .crewBodyRow {
        margin: 4px 0;
        .link-contain {
          min-width: 50px !important;
        }
        .actionDiv {
          padding: 0 !important;
          a {
            margin-left: 30px;
            font-size: 14px;
          }
        }
        .crewBodyData {
          margin: 0;
          padding: 0 20px;
          display: flex;
          align-items: center;
          height: 34px;

          &.groupData {
            background-color: #ffffff;
            border: solid 1px #e0e1e9;
            margin-bottom: 10px;
            height: 34px;
            min-width: 110px;
            @media (max-width: 600px) {
              min-width: 180px;
            }

            &.groupData.first {
              border-radius: 5px 0 0 5px;
            }

            &.groupData.last {
              border-radius: 0 5px 5px 0;
              margin-right: 10px;
            }
          }

          &.invoiceStatus {
            margin-bottom: 10px;
            min-width: 120px;
            span {
              height: 34px;
              border-radius: 5px;
              padding: 0;
            }
          }
        }
      }
    }
  }
`;

export default InvoiceDepartmentWrapper;
