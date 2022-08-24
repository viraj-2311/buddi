import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import bgBuddiBandImage from '@iso/assets/images/buddi-band-large-bg.webp';
import skipImage from '@iso/assets/images/Next-Buddi-band.svg';

const AccountSuccessStyleWrapper = styled.div`
  background: ${(props) =>
    `url(${props.background || bgBuddiBandImage}) no-repeat center center`};
  padding: 50px 0px;
  position: relative;
  min-height: 100vh;
  align-items: center;
  display: flex;
  background-size: cover;
  @media (max-width: 767px) {
    .ant-row {
      padding: 1rem;
    }
  }

  .title {
    font-size: 40px;
    font-weight: bold;
    line-height: 1.38;
    margin-bottom: 55px;
    text-align: center;
    color: #ffffff;
    @media (max-width: 767px) {
      min-height: auto;
      font-size: 2rem;
      margin-bottom: 2rem;
    }
  }

  .subTitle {
    font-size: 25px;
    text-align: center;
    color: #ffffff;
    margin-bottom: 55px;
    @media (max-width: 767px) {
      margin-bottom: 2rem;
    }
  }

  .success-step-container {
    max-width: 1260px;
    margin: auto;
  }

  .steps {
    min-height: 450px;
    > div {
      padding: 15px;
    }
  }

  .step-card {
    @media (max-width: 767px) {
      padding: 1.5rem;
    }
    height: 100%;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #f0f0f7;
    background-color: #ffffff;
    max-width: 395px;
    color: #43425d;

    .step-card-title {
      font-size: 25px;
      padding-bottom: 25px;
      margin: 25px 0 20px;
      border-bottom: solid 1px #f48d3a;
      text-align: center;
      font-weight: bold;
      color: #43425d;
    }
    .step-card-company {
      /* min-height: 104px; */
    }
  }

  .step-card-icon {
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

  .step-card-action {
    margin: 40px auto 0px;
    display: flex;
    justify-content: center;
    a.disable {
      pointer-events: none;
    }
  }

  .skip-go {
    padding-right: 1rem;
    text-align: right;
    position: relative;
    margin-top: 75px;

    button {
      font-size: 20px;
      font-weight: bold;
      background-size: 48px;
      color: #ffffff;
      border-color: transparent;
      box-shadow: none;
      padding: 20px 70px 20px 0px;
      height: auto;
      background: url(${skipImage}) no-repeat right center;

      &:hover,
      &:focus {
        outline: none;
        border-color: transparent;
        color: #ffffff;
        box-shadow: none;
      }
      &::after {
        display: none;
      }
    }

    .footer-logo {
      text-align: center;
      margin-top: 55px;

      img {
        width: 167px;
      }
    }
  }
`;

export default WithDirection(AccountSuccessStyleWrapper);
