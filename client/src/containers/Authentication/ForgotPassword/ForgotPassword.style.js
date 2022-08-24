import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const ForgotPasswordStyleWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  @media only screen and (max-width: 767px) {
    height: auto;
    flex: 1;
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

  .isoFormContentWrapper {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: relative;
    background-color: #ffffff;
    border-radius: 6px 0 0 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 375px;
    padding-left: 30px;
    padding-right: 30px;
  }

  .isoFormContent {
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #ffffff;
    justify-content: center;
    @media only screen and (max-width: 767px) {
      width: 100%;
      padding-top: 30px;
      justify-content: flex-start;
    }

    .isoFormHeadText {
      width: 100%;
      margin-bottom: 30px;

      h3 {
        font-size: 30px;
        font-weight: bold;
        line-height: 1.2;
        margin: 0 0 20px 0;
        color: ${palette('text', 0)};
      }

      p {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .isoFormFooterText {
      padding-bottom: 30px;
      p {
        font-size: 14px;
        font-weight: 400;
        line-height: 1.2;
        margin: 0;
        color: ${palette('text', 2)};
      }
    }

    .isoForgotPassForm {
      width: 100%;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      margin-bottom: 30px;

      .isoInputWrapper {
        margin-bottom: 30px;

        &:last-child {
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

        .fieldLabel {
          font-size: 13px;
          color: #868698;
          display: block;

          &.required {
            &::after {
              content: '*';
              color: ${palette('error', 0)};
            }
          }
        }

        .helper-text {
          color: ${palette('error', 0)};
        }
      }
    }
  }
`;

export default WithDirection(ForgotPasswordStyleWrapper);
