import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const SetupWalletStyleWrapper = styled.div`
  .setup-wallet-container {
    max-width: 768px;
    margin: auto;
    padding: 30px;

    @media only screen and (max-width: 767px) {
      padding: 30px 20px;
    }

    @media only screen and (max-width: 374px) {
      padding: 20px 10px;
    }
  }

  .setup-wallet-container__header {
    text-align: center;
    color: white;

    .icon {
      display: inline-block;
      margin: 10px;
      background: #808bff;
      padding: 5px 15px;
      border-radius: 10px;
      font-size: 30px;
    }
  }

  .setup-wallet-container__body {
    background: white;
    border-radius: 10px;
    min-height: 100px;
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .setup-wallet-container__footer {
    display: flex;
    color: white;

    @media only screen and (max-width: 767px) {
      padding-left: 10px;
      padding-right: 10px;
    }

    .button-wrapper {
      flex: 50%;

      button {
        font-size: 16px;
        color: white;
        font-weight: normal;
        border-color: transparent;
        box-shadow: none;
        display: flex;
        align-items: center;

        &::after {
          display: none;
        }

        &.step-back {
          svg {
            margin-right: 20px;

            @media only screen and (max-width: 767px) {
              margin-right: 15px;
            }
          }
        }

        &.step-next {
          svg {
            margin-left: 20px;

            @media only screen and (max-width: 767px) {
              margin-left: 15px;
            }
          }
        }
      }
    }

    .button-wrapper--right {
      button {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
  .step-view {
    margin: 30px;
    display: flex;
    flex-direction: row;
    position: relative;

    .connection-line {
      height: 3px;
      background-color: #f48d3a;
      position: absolute;
      left: 0;
      top: 18px;
      width: 70%;
      left: 15%;
    }

    .item-step {
      display: flex;
      align-content: center;
      width: 100%;
      justify-content: center;
      flex-direction: column;
    }
    .circle-step {
      border: solid 3px #f48d3a;
      border-radius: 19px;
      width: 38px;
      height: 38px;
      color: #f48d3a;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      z-index: 1;
      background-color: #3f475b;
      span {
        color: white;
        font-size: 13px;
        font-weight: bold;
      }
    }
    .completed-step {
      background-color: #f48d3a;
    }
    .step-title {
      text-align: center;
      color: white;
      margin-top: 5px;
      font-size: 13px;
    }
  }
`;

export default WithDirection(SetupWalletStyleWrapper);
