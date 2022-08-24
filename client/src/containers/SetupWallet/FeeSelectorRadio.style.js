import styled from 'styled-components';

const FeeSelectorRadioWrapper = styled.div`
  .standard-view {
    justify-content: center;
  }
  .fee-container {
    justify-content: center;
    display: flex;
    margin-top: 10px;
    &.left {
      padding-right: 10px;
      @media only screen and (max-width: 767px) {
        padding-right: 0;
      }
    }

    &.right {
      padding-left: 10px;
      @media only screen and (max-width: 767px) {
        padding-left: 0;
      }
    }
    input {
      opacity: 0;
    }

    label {
      display: block;
      height: 125px;
      padding: 30px 0 30px 30px;
      border: 1px solid #bcbccb;
      border-radius: 10px;
      margin-bottom: 30px;
      max-width: 300px;
      min-width: 300px;
    }

    .fee-option-container {
      display: flex;
      justify-content: flex-start;
    }

    .fee-option-icon {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      background-color: #f48d3a;
      justify-content: center;
      align-items: center;
      display: flex;
      border: solid 1px #bcbccb;
    }

    .fee-option-group {
      padding-left: 10px;
    }

    .fee-option-text {
      font-size: 20px;

      .bold {
        font-weight: bold;
      }
    }

    .fee-option-sub-text {
      font-size: 15px;
    }

    input[type='radio']:checked + label {
      border-color: #51369a;

      .fee-option-icon {
        background-color: #f48d3a;
      }

      .fee-option-text {
        color: #f48d3a;
      }
    }
  }
`;

export default FeeSelectorRadioWrapper;
