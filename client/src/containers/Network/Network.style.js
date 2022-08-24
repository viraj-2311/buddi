import styled from 'styled-components';

export const ImportConnectionDiv = styled.div`
  display: flex;
  padding: 15px 30px 0;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  background-color: #ffffff;
  overflow: hidden;

  h2,
  h3 {
    font-size: 20px;
  }

  h2,
  h3,
  p {
    color: #2f2e50;
  }

  h2 {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 15px;
  }

  h3 {
    font-weight: normal;
    margin-bottom: 18px;
    line-height: normal;
  }

  p {
    font-size: 15px;
    line-height: 1.35;
  }

  .ant-row {
    width: 100%;
    align-items: center;
  }

  .connectDetail {
    max-width: 620px;
  }

  .connectForm {
    margin: 15px 0 20px 0;

    .fieldLabel {
      color: #868698;
    }

    button {
      min-width: 157px;
      margin-top: 20px;
      margin-bottom: 17px;
    }

    .continueBtn {
      background-color: rgba(81, 54, 154, 1);
      border-color: rgba(81, 54, 154, 1);
      color: #ffffff;

      &:hover {
        background-color: rgba(81, 54, 154, 0.8);
        border-color: rgba(81, 54, 154, 0.8);
      }
    }
  }
  .benji-monitor-img {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    @media only screen and (max-width: 767px) {
      margin-bottom: 20px;
    }
    img {
      max-width: 100%;
    }
  }
`;
