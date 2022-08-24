import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const WalletNotSet = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
  }

  .ant-modal-body {
    text-align: center;
    padding: 35px 40px;
    position: relative;

    .closeBtn {
      position: absolute;
      right: 30px;
      top: 30px;
    }

    .modal-icon-wrapper {
      margin-bottom: 30px;

      .anticon {
        font-size: 50px;
      }
    }

    .title {
      font-size: 25px;
      color: ${palette('text', 5)};
      font-weight: bold;
      margin-bottom: 20px;
      line-height: normal;
    }

    .description {
      font-size: 15px;
      max-width: 250px;
      color: ${palette('text', 5)};
      margin: 0 auto 30px auto;
    }

    .actions {
      display: flex;
      justify-content: center;

      button {
        width: 200px;
        font-size: 15px;
      }
    }
  }
`;

export default WalletNotSet;
