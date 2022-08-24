import styled from 'styled-components';

export const CardWrapper = styled.div`
  width: 100%;
  .ant-card-head {
    min-height: 10px;
  }
  .ant-card-head-title {
    padding-bottom: 5px;
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
  display: flex;
  align-items: center;

  .ant-checkbox-wrapper {
    .ant-checkbox {
      position: relative;
      top: -1px;
  
      &:after {
        display: none;
      }
      
      .ant-checkbox-inner {
        width: 18px;
        height: 18px;
        background-color: transparent;
        border: solid 2px #d9d9e2;
      }
      
      &.ant-checkbox-checked {
        .ant-checkbox-inner {
          background-color: #5c4da0;
          border-color: transparent;
        }
      }
    }
  }
  
  .userAvatar {
    margin: 0px 20px;
    min-width: 70px;
    max-width: 70px;
    min-height: 70px;
    max-height: 70px;
    border-radius: 70px;
    overflow: hidden;
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

    h4,h6{
      color: #2f2e50;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
    }

    h4 {
      font-size: 20px;
      margin-bottom: 7px;
      font-weight: bold;
    }

    h6 {
      font-size: 13px;
    }

    .basicDetail{
      margin-right:auto;
    }

    .actions{
      button {
        margin-right: 20px;
        min-width : 157px;
      }
    }
    .ellipseIcon {
      color: #2f2e50;
      font-size: 25px;
    }

    .viewBtn {
      background-color: rgba(81, 54, 154, 1);
      border-color: rgba(81, 54, 154, 1);
      color: #ffffff;
      &:hover {
        background-color: rgba(81, 54, 154, 0.8);
        border-color: rgba(81, 54, 154, 0.8);
      }
    }

    .connectBtn {
      &:hover,&:focus {
        border-color: #d9d9d9;
        color: #595959;
      }
    }
`;

export const CardDescription = styled.h4``;

export const CardIcon = styled.img`
  width: 15px;
  height: 15px;
  margin-right: ${(props) => props.mr && props.mr}px;
`;
