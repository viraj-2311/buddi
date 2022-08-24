import { Row, Col } from 'antd';
import styled from 'styled-components';
import Modal from '@iso/components/Modal';

export const CreateInvoiceModal = styled(Modal)`
  &.ant-modal {
    @media (max-width: 991px) {
      width: calc(100% - 60px) !important;
    }
  }
`;
export const InvoiceFormWrapper = styled.div`
  margin-left: 11px;
  margin-right: 11px;
  .fieldLabel {
    color: #868698;
  }
  .stateColumn {
    @media (min-width: 576px) {
      padding-right: 6px !important;
      padding-left: 6px !important;
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #d9d9e2;
  margin-top: 20px;
  padding-top: 40px;

  button {
    margin-left: 20px;
  }

  .createBtn {
    width: 195px;
  }

  .cancelBtn {
    width: 155px;
  }
`;

export const RowTitle = styled(Col)`
  margin-bottom: 25px;
  h3 {
    font-size: 20px;
    font-weight: bold;
    color: #2f2e50;
  }
`;

export const InvoiceRow = styled(Row)`
  margin-bottom: 25px;

  hr {
    height: 1px;
    opacity: 0.5;
    background-color: #b4b4c6;
    width: calc(100% - 30px);
    margin-top: 20px;
  }
`;
