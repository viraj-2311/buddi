import { Table } from 'antd';
import styled from 'styled-components';

const TableComponent = styled(Table)`
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #f0f0f7;
  background-color: #ffffff;
  border-radius: 5px;
  overflow: hidden;

  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #51369a;
  }

  .ant-checkbox-inner {
    border: 2px solid #bcbccb;
    &::after {
  background-color: #f48d3a !important;
    }
  }

  .ant-checkbox-checked {
    &::after {
      border-color: transparent;
    }
    .ant-checkbox-inner {
      border-width: 1px;
      background-color: #51369a;
      border-color: transparent !important;
    }
  }
  .ant-table-thead {
    font-size: 13px;
  }
  .ant-table-thead > tr > th {
    .display-none {
      display: none;
    }

    background: none;
    font-weight: bold;
    padding-top: 15px;
    padding-bottom: 15px;
    .ant-table-column-sorters {
      padding-top: 0;
      padding-bottom: 0;
    }
    &:first-child {
      padding-left: 30px;
    }
  }
  .ant-table-tbody > tr > td {
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 15px;
    line-height: 1.4;
    &:first-child {
      padding-left: 30px;
    }
    &:last-child {
      padding-right: 30px;
    }
  }

  .ant-table-bordered .ant-table-thead > tr > th,
  .ant-table-bordered .ant-table-tbody > tr > td {
    white-space: normal;
    &.noWrapCell {
      white-space: nowrap;
    }

    @media only screen and (max-width: 920px) {
      white-space: nowrap;
    }
  }

  .ant-table-pagination.ant-pagination {
    padding-right: 16px;
  }
`;

export default TableComponent;

export const TableColumn = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;

  &.action-btn {
    display: flex;
    align-items: center;
    justify-items: center;
    margin-left: auto;
  }

  button {
    span {
      display: block;
      margin: 0 !important;
      svg {
        color: #2f2e50;
        &:first-child {
          height: 10px;
          width: 10px;
        }
      }
    }
  }
`;

export const TableHeaderActionDiv = styled.div`
  display: flex;
  position: absolute;
  top: 30px;
  left: 14px;

  @media (max-width: 767px) {
    flex-direction: column;
  }

  button.ant-btn.ant-btn-round {
    background-image: none;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 165px;

    @media (max-width: 767px) {
      min-width: 145px;
    }

    svg {
      margin-right: 10px;
      width: 20px;
      height: 20px;
      color: #fff;
    }

    &.downloadBtn {
      background-color: rgba(81, 54, 154, 1);
      border-color: rgba(81, 54, 154, 1);
      color: #ffffff;
      margin-right: 20px;
      &:hover {
        background-color: rgba(81, 54, 154, 0.8);
        border-color: rgba(81, 54, 154, 0.8);
      }
      @media (max-width: 767px) {
        margin-right: 0;
      }
    }
    &.deleteBtn {
      border-color: #2f2e50;
      color: #2f2e50;
      background: none;
      svg {
        color: #000;
      }
      &:hover {
        border-color: #2f2e50;
        background: none;
        color: #2f2e50;
      }

      @media (max-width: 767px) {
        margin-top: 20px;
      }
    }
  }
`;

export const TableWrapper = styled.div`
  &.archived-job-t {
    .ant-table-thead {
      tr {
        th {
          padding-top: 20px;
          .ant-table-selection {
            top: 25px;
            left: 28px;
          }
        }
      } 
    } 
  }

  .ant-table-thead {
    > tr > th {
      padding-top: 100px;

      @media (max-width: 767px) {
        padding-top: 170px;
      }

      .ant-table-selection {
        position: absolute;
        top: 45px;
      }
    }
  }
`;
