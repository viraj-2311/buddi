import styled from 'styled-components';

export const CardWrapper = styled.div`
  width: 100%;
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

  .userAvatar {
    margin: 0 auto 20px;
    min-width: 80px;
    max-width: 80px;
    min-height: 80px;
    max-height: 80px;
    border-radius: 80px;
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

    h4,
    p,
    h5 {
      color: #2f2e50;
    }

    h4 {
      font-size: 18px;
      font-weight: bold;
    }

    h5 {
      font-size: 13px;
      margin-bottom: 5px;
      line-height: 1.3;
      margin: 10px 0 15px;
      min-height: 36px;
    }

    p {
      font-size: 12px;
      display: flex;
      max-width: 145px;
      margin: 0 auto 20px;

      svg {
        margin-right: 6px;
      }
    }

    .connectBtn {
      min-width: 157px;
      background-color: rgba(81, 54, 154, 1);
      border-color: rgba(81, 54, 154, 1);
      color: #ffffff;
      &:hover {
        background-color: rgba(81, 54, 154, 0.8);
        border-color: rgba(81, 54, 154, 0.8);
      }
    }
  }
`;

export const CardIcon = styled.img`
  width: 15px;
  height: 15px;
  margin-right: ${(props) => props.mr && props.mr}px;
`;
