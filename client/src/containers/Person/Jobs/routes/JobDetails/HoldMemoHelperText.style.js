import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const WDHoldMemoHelperTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  background-color: #222229;
  color: #fff;
  overflow: hidden;
  @media only screen and (max-width: 1023px) {
    flex-flow: wrap;
  }

  .stepBox {
    min-width: 150px;
    padding: 20px;
    position: relative;
    display: flex;
    align-items: center;
    font-size: 13px;
    line-height: 1.5;
    flex: 1;
    @media only screen and (max-width: 1023px) {
      max-width: 100%;
      min-width: 100%;
    }
    strong {
      font-size: 16px;
      min-width: 36px;
      height: 36px;
      line-height: 36px;
      border-radius: 50px;
      background-color: #f48d3a;
      color: #fff;
      text-align: center;
      margin-right: 20px;
    }
    span {
      font-size: 13px;
      line-height: 1.5;
      margin-right: 5px;
    }
    .mobile-close-btn {
      @media only screen and (min-width: 1024px) {
        display: none;
      }
      @media only screen and (max-width: 1023px) {
        position: absolute;
        right: 15px;
        top: 15px;
        svg {
          width: 16px;
          height: 16px;
          color: #fff;
        }
      }
    }
  }
  .border-bottom {
    @media only screen and (max-width: 1023px) {
      border-bottom: 1px solid #a3a0fc;
    }
  }

  .stepBoxFirst {
    padding: 20px 0 20px 24px;
    font-weight: bold;
    font-size: 20px;
    flex-shrink: 0;
  }

  .stepBoxLast {
    font-size: 12px;
    padding: 20px 30px 20px 20px;
    line-height: normal;
    strong {
      background: #fff;
      color: #322d72;
    }
    a {
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -8px;
      svg {
        width: 16px;
        height: 16px;
        color: #fff;
        opacity: 0.8;
      }
      @media only screen and (max-width: 1023px) {
        display: none;
      }
    }
  }

  .stepBoxBorder:after {
    position: absolute;
    content: '';
    height: 40px;
    width: 1px;
    background: #f48d3a;
    top: 50%;
    right: 0;
    margin-top: -20px;
    @media only screen and (max-width: 1023px) {
      width: 0;
    }
  }
`;

const HoldMemoHelperTextWrapper = WithDirection(WDHoldMemoHelperTextWrapper);

export default HoldMemoHelperTextWrapper;
