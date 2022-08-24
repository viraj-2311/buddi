import styled from 'styled-components';

const JobBoardLayout = styled.div`
  background: #ffffff;
  padding: 35px 40px;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 768px) {
    padding: 20px 20px;
  }
  @media only screen and (max-width: 425px) {
    padding: 10px 10px;
  }
`;

export const ParentContainer = styled.div`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

/* like display:flex but will allow bleeding over the window width */
export const Container = styled.div`
  min-width: 300px;
  display: flex;
  flex-wrap: wrap;

  .viewAllCompleted {
    font-size: 13px;
    font-weight: bold;
    color: #ffffff;
    padding: 7px 18px;
    height: 30px;
    background: #19913d;
    border-color: #19913d;
    border-radius: 15px;
    opacity: 0.5;

    &:hover {
      background: #19913d;
      border-color: #19913d;
      color: #ffffff;
      opacity: 1;
    }
  }
`;

export const JobHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 30px;
  @media only screen and (max-width: 767px) {
    flex-wrap: wrap;
  }
  @media only screen and (max-width: 425px) {
    padding-left: 10px;
    padding-top: 10px;
  }

  h1 {
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 30px;
    font-weight: bold;

    .ant-badge {
      margin-left: 20px;
    }
  }
`;

export const JobHeaderAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  @media only screen and (max-width: 767px) {
    justify-content: flex-start;
  }
  @media only screen and (max-width: 425px) {
    flex-wrap: wrap;
  }

  button.ant-btn {
    border-radius: 50px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    @media only screen and (max-width: 767px) {
      margin-left: 0;
      margin-top: 15px;
      &.declinedBtn {
        margin-right: 20px;
      }
    }

    span {
      margin-left: 10px;
    }
  }

  .callSheetBtn {
    background-color: #3b86ff;
    border-color: #3b86ff;
    color: #fff;
    &:hover {
      background-color: #2272f4;
      color: #fff;
      border-color: #2272f4;
    }
  }
  .declinedBtn {
    background-color: #ff6565;
    border-color: #ff6565;
    color: #fff;
    &:hover {
      background-color: #f94d4d;
      color: #fff;
      border-color: #f94d4d;
    }
  }
  .archivedBtn {
    background-color: #f5f7fa;
    border-color: #f5f7fa;
    color: #2f2e50;
    &:hover {
      background-color: #e3eaf4;
      border-color: #e3eaf4;
      color: #2f2e50;
    }
  }
`;

export default JobBoardLayout;
