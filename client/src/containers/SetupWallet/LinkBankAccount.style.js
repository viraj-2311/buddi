import styled from 'styled-components';

const LinkBankAccountWrapper = styled.div`
  padding: 30px 50px;
  position: relative;

  .add-manual-card {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: red;
  }

  @media only screen and (max-width: 500px) {
    padding: 20px;
  }

  .link-bank-account__header {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
  }

  .link-bank-account__body {
    margin-top: 30px;

    .recommended-area {
      background-image: linear-gradient(#222229, #3f475b);
    }
    .recommended-color {
      color: white;
    }
    .bank-account-area {
      width: 280px;
      height: 380px;
      margin: auto;
      margin-bottom: 15px;
      padding: 20px;
      padding-top: 60px;
      border-radius: 5px;
      background-color: rgba(60, 67, 86, 0.1);
      position: relative;

      @media only screen and (max-width: 374px) {
        width: 220px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .recommended {
        position: absolute;
        top: 0;
        height: 36px;
        left: 60px;
        right: 60px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        background-color: rgba(244, 141, 58, 0.8);
        align-items: center;
        color: white;
        text-align: center;
        display: flex;
        justify-content: center;
        font-weight: bold;
      }
    }

    .bank-account-area__icon {
      width: 100px;
      padding: 22px;
      margin: auto;
      text-align: center;
      border-radius: 5px;
      background-color: #f48d3a;
    }

    .plaid-icon-bg {
      background-color: white;
    }

    .bank-account-area__text {
      height: 93px;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 25px;
    }

    .bank-account-area__button {
      text-align: center;
    }

    .bank-button {
      font-size: 14px;
      min-width: 180px;
    }
    .disableButton {
      opacity: 0.5;
    }
  }
`;

export default LinkBankAccountWrapper;
