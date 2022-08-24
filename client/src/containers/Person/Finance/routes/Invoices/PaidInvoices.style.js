import styled from 'styled-components';
import ConfirmModal from '@iso/components/Modals/ConfirmNew';

const PaidInvoiceRemoveConfirm = styled(ConfirmModal)`
  .ant-modal {
    width: 122px !important;
    /* @media (max-width: 1024px) {
      width: calc(100% - 60px) !important;
    } */
  }
  &.ant-modal {
    width: 122px !important;
    /* @media (max-width: 1024px) {
      width: calc(100% - 60px) !important;
    } */
  }
  .description {
    max-width: 300px;
  }
`;

export { PaidInvoiceRemoveConfirm };
