import styled from 'styled-components';

export const PersonalNetworkConnectionsWrapper = styled.div`
  padding: 40px;
  background: #f5f7fa;
  @media only screen and (max-width: 767px) {
    padding: 15px;
  }
`;

export const NoConnectionDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 40px 30px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;
  margin-bottom: 30px;

  .logo-view {
    justify-content: right;
    display: flex;
    text-align:center;
    @media only screen and (max-width: 767px) {
      margin-top: 30px;
      justify-content: center;
      display: flex;
    }
    img {
      width: 100%;
      max-width: 220px;
    }
  }

  .ant-row {
    align-items: center;
    width: 100%;
  }

  h2,
  p {
    color: #2f2e50;
  }

  h2 {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
  }

  p {
    font-size: 15px;
    line-height: 1.33;
  }
`;

export const ConnectionListDiv = styled.div`
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;
  padding-bottom: 10px;

  .connectionHeader {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    background-color: #ffffff;
    padding: 35px 35px;

    .connectionListSortBy {
      display: flex;
      align-items: center;
      strong {
        color: #2f2e50;
        line-height: 1.5715;
        margin: 0 5px;
      }
      svg {
        position: relative;
        top: -2px;
      }
    }
  }

  .connectionListContent {
    flex: 1;
    .ant-spin {
      width: 100%;
      margin: 25px 0 20px;
    }
  }

  h2,
  p {
    color: #2f2e50;
  }
  h2 {
    font-size: 25px;
    font-weight: bold;
  }
  p {
    font-size: 15px;
  }

  .searchSection {
    min-width: 250px;
    @media only screen and (max-width: 767px) {
      width: 100%;
      min-width: 150px;
    }
    .ant-input-affix-wrapper {
      background-color: #fff;
    }
    .ant-input-prefix {
      margin-right: 6px;
    }
  }

  .connectionListTitle {
    padding-right: 20px;
    @media only screen and (max-width: 767px) {
      width: 100%;
      margin-bottom: 15px;
    }
  }
`;

export const ConnectionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 25px;
  @media only screen and (max-width: 767px) {
    padding: 10px 15px;
  }
`;
