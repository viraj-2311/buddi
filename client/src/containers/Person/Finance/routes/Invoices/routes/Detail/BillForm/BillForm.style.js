import styled from 'styled-components';
import Modal from '@iso/components/Modal';

const BillFormModal = styled(Modal)`
  &.ant-modal {
    @media (max-width: 567px) {
      width: calc(100% - 60px) !important;
    }
  }
  .ant-modal-close {
    .ant-modal-close-x {
      margin-right: 8px;
    }
  }
  .ant-modal-body {
    padding: 25px 35px;
  }
`;

const BillFormWrapper = styled.div`
  width: 100%;

  .formGroup {
    .phoneNumber {
      display: flex;
      justify-content: space-between;
    }
  }
  .actions {
    text-align: right;
    margin-bottom: 15px;

    button {
      margin-right: 20px;
      width: calc(50% - 10px);
      &:last-child {
        margin-right: 0;
      }

      &.blackBorder {
        border-color: #2f2e50;
        color: #2f2e50;
      }
    }
  }
`;

export default BillFormWrapper;
export { BillFormModal };
