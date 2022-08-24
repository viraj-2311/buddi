import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const SignInStyleWrapper = styled.div`
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
    .cIFeYF{
      height:100%;
    }
  }

  .isoLoginContentWrapper {
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

  .isoLoginContent {
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

    .isoLoginTitleWrapper {
      margin-bottom: 30px;
      display: flex;
      width: 100%;
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

    .isoSignInForm {
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

      .isoInputWrapper {
        margin-bottom: 20px;

        .helper-text {
          color: #ff4d4f;
        }

        .field-label {
          font-size: 13px;
          color: ${palette('text', 7)};
        }

        .isoForgotPass {
          font-size: 15px;
          color: ${palette('text', 8)};
        }

        .isoSignupButton {
          color: #2f80ed;
        }

        &:last-of-type {
          margin-bottom: 0;
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

      .isoActionWrapper {
        margin-top: 30px;
      }

      .paddingBottom {
        margin-bottom: 30px;
      }

      .leftRightComponent {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .isoHelperWrapper {
        margin-top: 35px;
        flex-direction: column;
      }

      .isoRememberMe {
        font-size: 15px;
        color: ${palette('text', 3)};
      }

      .isoForgotPass {
        font-size: 15px;
        color: ${palette('text', 3)};
        text-decoration: none;

        &:hover {
          color: ${palette('primary', 0)};
        }
      }

      .isoSignInBtn {
        width: 180px;
        margin-right: 20px;
        @media only screen and (max-width: 425px) {
          width: 150px;
        }
      }

      .isoSignUpBtn {
        width: 180px;
      }
    }
  }
`;

export default WithDirection(SignInStyleWrapper);
