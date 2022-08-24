import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const SignUpStyleWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  @media only screen and (max-width: 767px) {
    height: 100%;
    flex-direction: column;
    background-size: contain;
  }

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    z-index: 1;
    top: 0;
    left: ${(props) => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
    right: ${(props) => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
  }

  .logo-left-area{
    position: relative;
    display: block;
    height: 100vh;
    border: 1px solid;
    width: 100%;
    overflow: hidden;
    @media screen and (max-width:767px){
      height: 50vh;
    }
    .fpWa-dv{
      height:100%;
    }
  }

  .isoLogoWrapper {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: relative;
    min-width: 375px;
    @media only screen and (max-width: 767px) {
      max-height: 245px;
    }
  }

  .isoSignUpContentWrapper {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: relative;
    background-color: #ffffff;
    border-radius: 6px 0 0 6px;
    min-width: 375px;
    padding-left: 30px;
    padding-right: 30px;
    overflow-y: auto;
  }

  .isoSignUpContent {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 767px) {
      width: 100%;
      padding-top: 30px;
      justify-content: flex-start;
    }

    .isoSignUpTitleWrapper {
      margin-bottom: 30px;
      display: flex;
      max-width: 450px;
      width: 100%;

      @media screen and (min-width:1480px){
        max-width: 60%;
      }
      @media screen and (max-width:1199px){
        max-width: 390px;
      }
      @media screen and (max-width:767px){
        max-width: 100%;
        justify-content:center;
      }

      h3 {
        font-size: 30px;
        font-weight: bold;
        margin-top:20px;
        justify-content: flex-start;
        color: ${palette('text', 6)};
        text-align: left;
        @media screen and (max-width:1199px){
          font-size: 24px;
        }
        @media screen and (max-width:767px){
          font-size: 18px;
        }
      }
    }

    .isoSignUpForm {
      max-width: 450px;
      width: 100%;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      @media screen and (min-width:1480px){
        max-width: 60%;
      }
      @media screen and (max-width:1199px){
        max-width: 390px;
      }
      @media screen and (max-width:767px){
        max-width: 95%;
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
      .isoActionWrapper {
        margin-bottom: 30px;
      }

      .button-create {
        margin-right: 20px;
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
    }
  }

  .isoSignUpTokenError {
    font-size: 30px;
    color: #ffffff;
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

export { PasswordHintTextWrapper };

export default WithDirection(SignUpStyleWrapper);
