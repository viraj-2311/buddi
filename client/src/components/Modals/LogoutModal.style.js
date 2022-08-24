import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Button from '@iso/components/uielements/button';

const LogoutModal = styled(Modal)`
  &.ant-modal {
    @media (max-width: 460px) {
      width: calc(100% - 60px) !important;
    }
  }
  .ant-modal-content {
    border-radius: 10px;
  }

  .ant-modal-body {
    text-align: center;
    padding: 35px 40px 45px 40px;
    position: relative;

    .closeBtn {
      position: absolute;
      right: 30px;
      top: 30px;
    }

    .modal-icon-wrapper {
      margin-bottom: 30px;
      line-height: normal;

      svg {
        height: 50px;
        width: 50px;
      }
    }

    .title {
      font-size: 25px;
      color: ${palette('text', 5)};
      font-weight: bold;
      margin-bottom: 20px;
      line-height: normal;
      @media (max-width: 460px) {
        font-size: 22px;
        margin-bottom: 15px;
      }
      @media (max-width: 320px) {
        font-size: 20px;
      }
    }

    .description {
      font-size: 15px;
      max-width: 270px;
      color: ${palette('text', 5)};
      margin: 0 auto 30px auto;
      @media (max-width: 460px) {
        font-size: 14px;
      }
      @media (max-width: 320px) {
        font-size: 13px;
      }
    }
    .boldDescription {
      font-size: 20px;
      max-width: 290px;
      font-weight: bold;
      margin-bottom: 35px;

      @media (max-width: 460px) {
        font-size: 17px;
        margin-bottom: 30px;
      }
    }

    .actions {
      button {
        font-size: 15px;
        width: 100%;
      }
    }
  }
`;

export default LogoutModal;