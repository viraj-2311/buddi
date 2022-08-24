import styled from 'styled-components';
import { palette } from 'styled-theme';

const CreateCompanyModalWrapper = styled.div`
  .topFieldWrapper {
    padding: 20px 0px 20px;
    border-bottom: 1px solid ${palette('border', 9)};

    .formGroup {
      margin-top: 40px;
    }
  }

  .bottomFieldWrapper {
    padding: 20px 20px 20px 0;
    .ant-row{
      flex-flow:row !important;
    }
    .formGroup {
      margin-bottom: 0;
    }
  }

  .dividerWrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .divider {
      height: 75px;
      border-left: 1px solid ${palette('border', 9)};
    }

    span {
      font-weight: bold;
      font-size: 15px;
      margin: 20px 0;
      color: ${palette('text', 5)};
    }
  }

  .actionBtnWrapper {
    text-align: center;
    margin-bottom: 40px;
    .ant-btn{
      padding:0 45px !important;
    }
  }

  .helper-text {
    color: ${palette('error', 0)};
  }
  .alert-message {
    margin-top: 20px;
    max-width: 250px;
    label {
      color: red;
    }
  }
  .hidden-message {
    margin-top: 20px;
    max-width: 250px;
    label {
      color: white;
    }
  }
`;

const MessageDiv = styled.div`
  background:#f5ece4;
  padding: 20px 25px;
  border-radius: 5px;
  display: flex;
  align-items: self-start;
  margin-bottom: 20px;
  color: #2f2e50;
  padding: 20px 15px 20px 15px;
  p {
    color: #43425d;
    font-family: 'Open Sans',Roboto,sans-serif;
    font-size: 13px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
  }

  p.modal-icon-wrapper {
    margin-right: 15px;
    > span {
      svg {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

export default CreateCompanyModalWrapper;
export { MessageDiv };