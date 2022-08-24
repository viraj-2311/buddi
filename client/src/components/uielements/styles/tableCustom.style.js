import styled from 'styled-components';

const AntTable = (ComponentName) => styled(ComponentName)`
  &.ant-table-wrapper {
    margin: 28px 0;
    border-radius: 10px;
    border: solid 1px #f0f0f7;
    overflow: hidden;

    .ant-table-thead > tr > th {
      background-color: #f0f0f7;
      font-weight: bold;
      color: #2f2e50;
      text-transform: none;

      @media only screen and (max-width: 767px) {
        padding: 16px 10px;
      }

      @media only screen and (max-width: 374px) {
        padding: 10px 5px;
      }
    }
    .ant-table-tbody > tr > td {
      border: none;
      border-top: 1px solid #e9e9f0;

      @media only screen and (max-width: 767px) {
        padding: 16px 10px;
      }

      @media only screen and (max-width: 374px) {
        padding: 10px 5px;
      }
    }
  }
`;

export default AntTable;
