import styled from 'styled-components';
import { palette } from 'styled-theme';

const SignInToCompanyWrapper = styled.div`
  .companySelectionTopFieldWrapper {
    padding: 35px;
  }

  .emailTopFieldWrapper {
    padding: 0 35px 35px;
  }

  .companySelectionTopFieldWrapper,
  .emailTopFieldWrapper {
    .formGroup {
      margin: 30px 0;
    }

    h1,
    h3 {
      text-align: center;
      color: ${palette('text', 6)};
    }

    h1 {
      font-size: 30px;
      font-weight: bold;
      line-height: normal;
    }

    h3 {
      font-size: 15px;
    }
    .actionBtn {
      text-align: center;
    }
  }

  .customRow {
    margin-top: 30px;
  }

  .dividerWrapper {
    display: flex;
    align-items: center;
    margin-top: 30px;

    .divider {
      width: 50%;
      display: block;
      height: 1px;
      background-color: #d9d9e2;
    }

    span {
      font-size: 13px;
      color: #9293a2;
      margin: 0 15px;
    }
  }

  .actionBtnWrapper {
    text-align: center;
    margin-bottom: 40px;
  }

  .helper-text {
    color: ${palette('error', 0)};
  }
`;

export default SignInToCompanyWrapper;
