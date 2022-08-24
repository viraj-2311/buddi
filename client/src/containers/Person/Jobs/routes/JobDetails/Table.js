import { Table } from 'antd';
import styled from 'styled-components';

const StyledContractorTable = styled(Table)`
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #f0f0f7;
  background-color: #ffffff;
  border-radius: 5px;
  overflow: hidden;
  
  .ant-table-thead > tr > th {
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

export default StyledContractorTable;
