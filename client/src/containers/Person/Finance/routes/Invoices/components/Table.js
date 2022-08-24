import { Table } from 'antd';
import styled from 'styled-components';

const StyledContractorInvoiceTable = styled(Table)`
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #f0f0f7;
  background-color: #ffffff;
  border-radius: 5px;
  overflow: hidden;

  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #f48d3a;
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
      background-color: #f48d3a !important;
    }
    .ant-checkbox-inner {
      border-width: 1px;
      background-color: #f48d3a !important;
      border-color: transparent !important;
    }
  }
  .ant-table-thead > tr > th {
    .display-none {
      display: none;
    }

    background: none;
    font-weight: bold;
    padding-top: 20px;
    padding-bottom: 20px;
    .ant-table-column-sorters {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .ant-table-tbody > tr > td {
    padding-top: 25px;
    padding-bottom: 25px;
    font-size: 13px;
    line-height: 1.4;
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

export default StyledContractorInvoiceTable;

export const TableColumn = styled.div`
  height: 30px;
  margin-top: 5px;
  display: flex;
  align-items: center;

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
