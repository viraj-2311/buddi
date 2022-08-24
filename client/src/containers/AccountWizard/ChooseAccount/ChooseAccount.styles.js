import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';
import radioCheck from '@iso/assets/images/radio_check.svg';
import bgImage from '@iso/assets/images/buddi-band-with-bg.webp';

const ChooseAccountStyleWrapper = styled.div`
  .account-options {
    margin-top: 20px;
    width: 100%;
  }

  .account-option {
    width: 100%;
    height: 100%;
    padding: 0;
    background: none !important;
    border: none !important;
    box-shadow: none !important;

    &::before {
      display: none !important;
    }

    &.ant-radio-button-wrapper-checked {
      color: #2f2e50;

      .card {
        &::before {
          content: '';
          position: absolute;
          top: 30px;
          right: 30px;
          height: 25px;
          width: 25px;
          z-index: 1;
          background: url(${radioCheck}) no-repeat center center;
        }
      }
    }
  }

  .card-icon {
    height: 88px;
    width: 88px;
    margin: 0 auto;
    text-align: center;
    line-height: 88px;
    border-radius: 100px;
    background-color: #f0f0f7;
    img {
      max-width: 37px;
    }
  }

  .card {
    @media (max-width: 767px) {
      padding: 10px;
    }
    padding: 30px 48px;
    border-radius: 10px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #f0f0f7;
    background-color: #ffffff;
    position: relative;
    height: 100%;
    font-size: 15px;
    color: ${palette('text', 5)};
    max-width: none;
    width: 50%;
    border: transparent;
    @media (max-width: 1199px) {
      width: 100%;
    }

    .card-head {
      padding: 25px 0;
      border-bottom: solid 1px #e8e8f1;

      .card-title {
        font-size: 25px;
        text-align: center;
        font-weight: bold;
        color: inherit;
        @media (max-width: 1600px) {
          font-size: 18px;
        }
        @media (max-width: 1400px) {
          font-size: 16px;
        }
      }
    }

    .card-price {
      padding: 20px 0;
      text-align: center;
      border-bottom: solid 1px #e8e8f1;

      .pricingAmount {
        text-align: center;

        span {
          font-size: 37px;
          font-weight: bold;
        }

        &.free {
          span {
            color: ${palette('text', 12)};
            /* color: #51369a; */
          }
        }
      }
    }

    .card-content {
      padding: 35px 10px 30px 20px;
      @media (max-width: 1600px) {
        min-height: 345px;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        color: #000000;

        li {
          font-size: 15px;
          display: flex;
          align-items: center;

          span {
            margin-left: 20px;
          }
        }
      }
    }

    .card-action {
      text-align: center;

      button {
        width: 180px;
        height: 54px;
      }
    }
  }
`;
export const AccountCardTitleWrapperStyle = styled.div`
  display: flex;
  h2 {
    padding-left: 0.5rem;
    margin: 0;
  }
  margin-bottom: 1rem;
`;
export const AccountCardFooterWrapperStyle = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const AccountCardPriceWrapperStyle = styled.div``;
export const AccountCardAmountStyle = styled.sub`
  color: ${palette('text', 12)};
  font-size: 37px;
  font-weight: bold;
  bottom: -0.5em;
  padding-left: 0.5rem;
  @media (max-width: 767px) {
    font-size: 30px;
  }
`;
export const AccountCardContentWrapperStyle = styled.sub`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    color: #000000;

    li {
      font-size: 15px;
      display: flex;
      align-items: center;
      line-height: 1.5rem;
      span {
        margin-left: 1rem;
      }
    }
  }
`;

export const AccountCardWrapperStyle = styled.div`
  .ant-card {
    border-radius: 10px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #f0f0f7;
    margin-bottom: 1rem;
  }
  .ant-radio-button-wrapper-checked {
    .ant-card {
      box-shadow: ${(props) => '0 2px 30px 0 rgba(0, 0, 0, 0.4)'};
      &:before {
        content: '';
        position: absolute;
        top: 30px;
        right: 30px;
        height: 25px;
        width: 25px;
        z-index: 1;
        background: url(${radioCheck}) no-repeat center center;
      }
    }
  }
`;

export const AccountTypeDiv = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: ${(props) =>
    props.isChecked ? '0 2px 30px 0 rgba(0, 0, 0, 0.4)' : 'none'};

  @media (max-width: 1199px) {
    display: block;
  }

  .account-type-image {
    border-radius: 10px 0 0 10px;
    background: ${(props) =>
      `url(${props.background || bgImage}) no-repeat center center`};
    background-size: cover;
    width: 50%;

    @media (max-width: 1199px) {
      width: 100%;
      height: 250px;
      border-radius: 10px 0 0;
    }
  }
`;

export default WithDirection(ChooseAccountStyleWrapper);
