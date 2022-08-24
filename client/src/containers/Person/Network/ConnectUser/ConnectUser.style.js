import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '@iso/components/Modal';

const ConnectUserModal = styled(Modal)`
  min-width: 320px;

  .viewButton {
    align-items: flex-end;
    display: flex;
  }
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
        padding-top: 10;

        label {
          margin-bottom: 12px;
          margin-top: 20px;
          color: #868698;
          font-size: 13px;
          font-weight: normal;
          display: inline-block;
        }
        .descNetwork {
          margin-top: 10px;
        }

        .textFieldEmail {
          display: flex;
          flex-direction: row;
        }
        .actionContinue {
          background-color: 'red';
          height: '100%';
        }
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

  .actionContinue {
    button {
      width: 100px;
      margin-right: 20px;
      font-size: 14px;
      color: ${palette('text', 5)};
    }
  }
`;

export const InputView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .leftContent {
    flex: 1;
    padding-right: 20;
  }
  .continueBtn {
    margin-bottom: 10px;
  }
  .inputEmail {
    margin-right: 20px;
    flex: 1;
    width: 100%;
    margin-bottom: 10px;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;

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

  .buttonWrap {
    margin-bottom: 10px;
  }
`;
export const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #ddd;

  &.more-user {
    justify-content: flex-start;
  }
  .network-icons {
    a {
      margin-left: 10px;
      display: inline-block;
      vertical-align: top;
    }
    img {
      width: 30px;
    }
    .icon-box {
      border-radius: 5px;
      border: solid 1px #bcbccb;
      width: 30px;
      height: 30px;
      line-height: 26px;
      text-align: center;
      svg {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .iconSize {
      width: 22px;
      height: 16px;
    }
  }

  p {
    font-size: 15px;
    color: #2f2e50;
  }
  .titleButton {
    color: #2f2e50;
    font-weight: normal;
  }
`;

const StylesLayout = {
  leftView: {
    marginRight: 20,
    flex: 1,
    width: '100%',
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
  },
};

export default ConnectUserModal;
