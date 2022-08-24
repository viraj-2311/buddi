import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import { palette } from 'styled-theme';

const AccountWizardStyleWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: rgb(240, 240, 247);
  background: linear-gradient(
    180deg,
    rgba(240, 240, 247, 1) 70%,
    rgba(255, 255, 255, 1) 100%
  );
  position: relative;
  padding: 50px;
  @media (max-width: 767px) {
    padding: 1.5rem;
  }

  h1 {
    color: #2f2e50;
    font-weight: bold;
    font-size: 1.5rem;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    line-height: 1.5;
    text-align: center;
    @media (min-width: 768px) {
      font-size: 2.5rem;
      line-height: 1.38;
    }
  }

  .white-box {
    @media (max-width: 767px) {
      padding: 1.5rem;
    }
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #f0f0f7;
    background-color: #ffffff;
    position: relative;
    max-width: 800px;
    margin: 40px auto;
    min-height: 450px;

    h2 {
      text-align: center;
      font-size: 20px;
      color: #2f2e50;
      margin-bottom: 30px;
      font-weight: bold;
    }

    .ant-row {
      width: auto !important;
    }

    .fieldLabel {
      color: #868698;
    }
  }

  .steps-nav {
    max-width: 750px;
    position: relative;
    .ant-steps-item-tail {
      &:after {
        height: 4px;
      }
    }
  }

  .step-nav-item {
    .ant-steps-item-container {
      :hover {
        .ant-steps-item-icon {
          border-color: ${palette('color', 15)} !important;
          .ant-steps-icon {
            color: ${palette('color', 15)} !important;
          }
        }
        .ant-steps-item-title {
          color: ${palette('color', 15)} !important;
        }
      }
      .ant-steps-item-tail{
        &:after{
          background-color: rgb(244 141 58);
        }
      }
    }
    .ant-steps-item-icon .ant-steps-icon {
      top: 1px;
    }

    &.ant-steps-item-active {
      .ant-steps-item-icon {
        background-color: #ffffff !important;
        span {
          color: ${palette('color', 15)};
        }
      }
    }

    &.ant-steps-item-finish {
      .ant-steps-item-icon {
        background-color: ${palette('color', 15)};

        span {
          color: #ffffff;
        }
      }
    }
    .ant-steps-item-content {
      display: block;

      .ant-steps-item-title {
        font-weight: normal;
        font-size: 13px;
        color: #2f2e50;
        &::after {
          display: none;
        }
      }
    }

    .ant-steps-item-icon {
      border: solid 3px ${palette('color', 15)};
      width: 38px;
      height: 38px;
      color: ${palette('color', 15)};
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        color: ${palette('color', 15)};
      }
    }
  }

  .step-container {
    width: 100%;
    padding: 0;
    margin: 0 auto;
  }

  .steps-content {
    min-height: 530px;
    max-width: 1620px;
    margin: auto;
  }

  .steps-action {
    padding: 0px 50px;
    margin-top: 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 767px) {
      margin-top: 3rem;
    }
    .ant-steps {
      @media (max-width: 767px) {
        display: none;
        justify-content: space-between;
      }
    }

    @media (max-width: 767px) {
      justify-content: space-between;
      padding: 0;
    }
    .navBtnWrapper {
      @media (max-width: 767px) {
        width: auto;
        margin: 0;
      }
      padding-bottom: 50px;
      width: 120px;
      margin: 0 100px;

      button {
        font-size: 20px;
        color: #2f2e50;
        font-weight: normal;
        border-color: transparent;
        box-shadow: none;
        display: flex;
        align-items: center;

        &::after {
          display: none;
        }

        &.step-back {
          img {
            margin-right: 30px;
          }
        }

        &.step-next {
          img {
            margin-left: 30px;
          }
        }
      }
    }
  }

  .helper-text {
    color: ${palette('error', 0)};
  }

  .wizardBtn {
    width: 200px;
    @media (max-width: 767px) {
      width: 141px;
      &:first-child {
        margin-right: 0.25rem;
      }
      + button {
        margin-left: 0.25rem;
      }
    }
  }

  .footer-logo {
    text-align: center;
    margin-top: 55px;

    img {
      max-width: 100px;
    }
  }
`;

export default WithDirection(AccountWizardStyleWrapper);
