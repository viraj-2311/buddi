import styled from 'styled-components';
import { palette } from 'styled-theme';

const CompanyOwnerWrapper = styled.div`
  .white-box {
    padding: 0;
  }

  .topFieldWrapper {
    padding: 20px 20px 20px;
    border-bottom: 1px solid ${palette('border', 9)};

    .formGroup {
      margin-top: 40px;
    }
    @media (max-width: 767px) {
      padding: 1.5rem;
    }
  }

  .bottomFieldWrapper {
    padding: 20px;
    @media (max-width: 767px) {
      padding: 1.5rem;
    }
    .ant-row{
      width: 100% !important;
      flex-flow: row !important;
    }
    .formGroup {
      margin-bottom: 0;
    }
    .ant-col:not(:first-child) {
      @media (max-width: 767px) {
        padding-top: 1rem;
      }
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
    margin-bottom: 2.5rem;
    @media (max-width: 767px) {
      margin-bottom: 0;
      padding: 1.5rem;
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

export default CompanyOwnerWrapper;
export { MessageDiv };
