import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const ConnectWithNetworkModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 5px;
  }

  .ant-modal-footer {
    width: 92%;
    margin: auto;
    padding: 10px 0;
  }

  .ant-modal-body {
    padding: 24px 35px 30px 35px;

    .content {
      .connectForm {
        .formGroup {
          margin-bottom: 30px;
        }
        p,
        h3 {
          color: #2f2e50;
        }

        p {
          margin-bottom: 28px;
          margin-top: 13px;
          font-size: 15px;
        }

        h3 {
          font-size: 20px;
          font-weight: bold;
        }

        .fieldLabel {
          color: #868698;
        }
      }

      .continueBtn {
        padding-left: 20px;
        button {
          width: 100%;
        }
      }
    }
  }
`;

export const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  padding: 30px 0px;

  .network-icons {
    a {
      margin-left: 20px;
      display: inline-block;
      vertical-align: top;
    }
    img {
      width: 48px;
    }
    .icon-box {
      border-radius: 10px;
      border: solid 1px #bcbccb;
      width: 48px;
      height: 48px;
      line-height: 44px;
      text-align: center;
      svg {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
`;

export default ConnectWithNetworkModal;
