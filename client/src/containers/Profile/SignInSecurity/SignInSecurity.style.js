import styled from 'styled-components';
import { palette } from 'styled-theme';

const SignInSecurityWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  height: 100%;

  .ant-card {
    height: 100%;
    border-radius: 10px;
  }
  .ant-card-body {
    padding: 30px;
  }
  .isoPasswordStrengthWrapper {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 20px;

    .isoPasswordStrength {
      flex: auto;
      margin-right: 10px;
    }

    .isoPasswordScore {
      color: ${palette('text', 7)};
      margin-right: 10px;
    }

    .isoPasswordHint {
      color: ${palette('primary', 0)};
    }
  }

  .isoAcceptTermsWrapper {
    margin: 30px 0;
  }

  .isoTosButton {
    color: #2f80ed;
  }

  .isoPrivacyButton {
    color: #2f80ed;
  }

  .fieldLabel {
    font-size: 13px;
    color: ${palette('text', 7)};
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  .helper-text {
    color: #ff4d4f;
  }

  input {
    &::-webkit-input-placeholder {
      color: ${palette('grayscale', 0)};
    }

    &:-moz-placeholder {
      color: ${palette('grayscale', 0)};
    }

    &::-moz-placeholder {
      color: ${palette('grayscale', 0)};
    }
    &:-ms-input-placeholder {
      color: ${palette('grayscale', 0)};
    }
  }
`;

const PasswordHintTextWrapper = styled.div`
  font-size: 11px;
  p {
    margin-bottom: 10px;
  }
  ul {
    padding-left: 14px;
    list-style-type: disc;

    li {
      &::marker {
        font-size: 12px;
        color: #19913d;
      }
    }
  }
`;

const ChangePasswordFormWrapper = styled.div`
  h2,
  h3,
  p {
    color: #2f2e50;
  }

  h2 {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 30px;
  }

  h3 {
    font-size: 20px;
    margin-bottom: 25px;
  }

  p {
    font-size: 15px;
    margin-bottom: 25px;
  }

  .actionRow {
    margin-top: 10px;

    button {
      min-width: 215px;
    }
  }
`;
export {
  PasswordHintTextWrapper,
  ChangePasswordFormWrapper,
  SignInSecurityWrapper,
};
