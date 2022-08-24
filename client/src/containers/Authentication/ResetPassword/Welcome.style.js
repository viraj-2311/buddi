import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import { palette } from 'styled-theme';
import bgImage from '@iso/assets/images/blue-bg.svg';

const WelcomeStyleWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
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

  .isoResetPasswordWelcomeContentWrapper {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: relative;
    background-color: #ffffff;
    border-radius: 6px 0 0 6px;
    min-width: 375px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .isoResetPasswordWelcomeContent {
    width: 100%;
    height: 100%;
    max-width: 700px;
    padding: 0% 10%;
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
    .button-login {
      min-width: 150px;
    }
    .isoResetPasswordWelcomeTitleWrapper {
      margin-bottom: 0px;

      h3 {
        font-size: 40px;
        font-weight: bold;
        color: ${palette('text', 6)};
      }
    }

    .isoResetPasswordWelcomeForm {
      width: 100%;
      padding-left: 30px;
      padding-right: 30px;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;

      .isoWelcomeTextWrapper {
        margin-bottom: 36px;
      }
    }
  }
`;

export default WithDirection(WelcomeStyleWrapper);
