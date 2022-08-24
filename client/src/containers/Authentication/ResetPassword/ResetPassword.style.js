import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';
import bgImage from '@iso/assets/images/blue-bg.svg';

const ResetPasswordStyleWrapper = styled.div`
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

  .isoFormContentWrapper {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: 6px 0 0 6px;
    min-width: 375px;
  }

  .isoFormContent {
    width: 100%;
    max-width: 500px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    padding-left: 30px;
    padding-right: 30px;

    @media only screen and (max-width: 767px) {
      width: 100%;
      padding-top: 30px;
      justify-content: flex-start;
    }

    .isoFormHeadText {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 30px;
      justify-content: center;

      h3 {
        font-size: 30px;
        font-weight: bold;
        line-height: 1.2;
        margin: 0 0 20px 0;
        color: ${palette('text', 0)};
      }

      p {
        font-size: 14px;
        font-weight: 400;
        line-height: 1.2;
        margin: 0;
        color: ${palette('text', 2)};
      }
    }
    .paddingBottom {
      padding-bottom: 30px;
    }
    .isoResetPassForm {
      width: 100%;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;

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

        .formLabel {
          font-size: 14px;
          color: #868698;
          display: block;
          padding-bottom: 10px;

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
    }
  }
`;

export default WithDirection(ResetPasswordStyleWrapper);
