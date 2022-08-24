import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CardWrapper = styled.div`
  width: 100%;
  .ant-card {
    border-radius: 10px;
    background-color: #ffffff;
  }
  .ant-card-body {
    padding: 0;
  }
`;

export const CardDetail = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 20px 0 10px;
  padding: 25px 0 0 0;

  h3,
  p {
    margin: 0;
    font-size: 13px;
  }
  p {
    margin: 5px 0 0 0;
  }
`;

export const CardDetailItem = styled.div`
  margin-left: 30px;
  h3 {
    font-weight: bold;
  }
  &:first-child {
    margin: 0;
  }
`;

export const CardTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardTitleAction = styled.div`
  .cardAction {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const CardTitle = styled.h2`
  font-size: 20px;
  color: #2f2e50;
  margin: 0 20px 0 0;
  white-space: normal;
  font-weight: bold;
`;

export const CardBody = styled.div`
  color: #2f2e50;
  padding: 25px 30px;
  display: flex;
  align-items: center;

  .userAvatar {
    margin: 0px 20px 0 0;
    min-width: 100px;
    max-width: 100px;
    min-height: 100px;
    max-height: 100px;
    border-radius: 100px;
    overflow: hidden;
    cursor: pointer;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .userInfo {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    h4,
    h5,
    h6 {
      color: #2f2e50;
    }

    h4 {
      font-size: 20px;
      font-weight: bold;
    }

    h5 {
      font-size: 15px;
      margin-top: 4px;
    }

    h6 {
      margin-top: 5px;
      font-size: 13px;
    }

    .basicDetail {
      margin-right: auto;
      max-width: 70%;
    }

    .ant-btn {
      min-width: 155px;
    }
    .acceptBtn {
      background-color: #f48d3a !important;
      border-color: #f48d3a !important;
      color: #ffffff;
      margin-left: 15px;
      // &:hover {
      //   background-color: rgba(81, 54, 154, 0.8);
      //   border-color: rgba(81, 54, 154, 0.8);
      // }
    }
  }
`;

export const CardDescription = styled.h4``;

export const CardIcon = styled.img`
  width: 15px;
  height: 15px;
  margin-right: ${(props) => props.mr && props.mr}px;
`;
