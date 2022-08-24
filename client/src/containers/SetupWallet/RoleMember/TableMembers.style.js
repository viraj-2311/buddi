import styled from 'styled-components';

const BusinessMembersTableWrapper = styled.div`
  flex: 1;
  .ant-table-wrapper {
    margin: 20px;
    min-width: 420px;
  }
  .actions {
    min-width: 80px;

    .ant-btn-link {
      margin-left: 30px;
      &:first-child {
        margin: 0;
      }
    }
  }
  .table-action {
    text-align: right;
    margin: 30px 20px;

    .addBtn {
      color: #3b86ff;
    }
  }

  .ant-table-tbody {
    span.table-data {
      font-size: 15px;
      color: #2f2e50;
    }
  }
`;

const StatusSpan = styled.span`
  display: inline-block;
  font-weight: bold;
  text-align: center;
  min-width: 100px;
  color: #ffffff !important;
  border-radius: 5px;
  background-color: ${(props) => props.color};
  padding: 5px 0;

  @media only screen and (max-width: 767px) {
    min-width: 80px;
  }

  @media only screen and (max-width: 374px) {
    font-size: 12px;
  }
`;

export { BusinessMembersTableWrapper, StatusSpan };
