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

  .isoSignUpWelcomeContentWrapper {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: relative;
    background-color: #ffffff;
    border-radius: 6px 0 0 6px;
    min-width: 375px;
    padding-left: 30px;
    padding-right: 30px;
  }

  .isoSignUpWelcomeContent {
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

    .isoSignUpWelcomeTitleWrapper {
      margin-bottom: 30px;

      h3 {
        font-size: 30px;
        font-weight: bold;
        color: ${palette('text', 6)};
        @media screen and (max-width:1199px){
          font-size: 24px;
        }
        @media screen and (max-width:767px){
          font-size: 18px;
        }
      }
    }

    .isoSignUpWelcomeForm {
      display: flex;
      flex-shrink: 0;
      flex-direction: column;

      .isoWelcomeTextWrapper, p {
        margin-bottom: 40px;
        color:#43425d;
        font-size:15px;
      }

      .isoActionWrapper {
        @media (min-width:768px) and (max-width:992px){
          button{
            max-width:100% !important;
            width:100% !important;
            margin-top:15px;
            margin-left:0px !important;
          }
        }
        @media (max-width:575px){
          button{
            max-width:100% !important;
            width:100% !important;
            margin-top:15px;
            margin-left:0px !important;
          }
        }
        .resend-email {
          width: 198px;
          height: 45px;
          border-radius: 100px;
          background-image: linear-gradient(to right, #c5370f -10%, #e17f08 112%);
          @media (min-width:993px) and (max-width:1075px){
            width: 158px;
          }
        }
        .signup-diff-email {
          max-width: 275px;
          width: 100%;
          margin-left:20px;
          height: 45px;
          background-image: linear-gradient(to right,#FFF -10%,#FFF 112%) !important;
          color: #43425d;
          border-radius: 100px;
          border: solid 1px #43425d;
        }
      }
    }
  }
`;

export default WithDirection(WelcomeStyleWrapper);
