import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const InviteToBenjiModal = styled(Modal)`
  .ant-modal-footer {
    width: 92%;
    margin: auto;
    padding: 10px 0;
  }

  .ant-modal-body {
    padding: 30px 35px;

    .content {
      .formGroup {
        margin-bottom: 30px;
        label {
          margin-bottom: 12px;
          margin-top: 20px;
          color: #868698;
          font-size: 13px;
          font-weight: normal;
          display: inline-block;
        }
      }

      h3 {
        font-size: 15px;
        font-weight: bold;
        color: #2f2e50;
      }
    }

    .actions {
      button {
        width: 160px;
        margin-right: 20px;
        font-size: 14px;
        color: ${palette('text', 5)};
      }
    }
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  button {
    min-width: 155px;
    margin-left: 20px;
    svg {
      color: #51369a;
    }
  }
  button.ant-btn.ant-btn-circle {
    background: #f5f7fa;
    border: none;
    min-width: 10px;
  }
`;

export const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #ddd;
  p {
    font-size: 15px;
    color: #2f2e50;
  }
`;

export default InviteToBenjiModal;
