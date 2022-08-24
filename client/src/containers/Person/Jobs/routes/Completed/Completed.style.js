import styled from 'styled-components';

const CompletedJobsWrapper = styled.div`
  padding: 35px 40px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
  .goBackBtn {
    margin-right: 26px;
  }
`;

const LocationSpan = styled.span`
  display: flex;
  align-items: center;
  svg {
    margin-right: 10px;
  }
`;

const TotalPayPrice = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
const ComponentTitle = styled.h3`
  font-size: 30px;
  font-weight: bold;
  color: #2f2e50;
  display: inline-block;
`;

const ButtonHolders = styled.div`
  display: flex;
  justify-content: flex-end;
  
  button.ant-btn {
    border: transparent;
    display: flex;
    align-items: center;
    margin-left: 20px;
    
    span {
      margin-left: 10px;
    }

    &.deleteBtn,
    &.deleteBtn:hover {
      background: #e25656;
      color: #ffffff;
    }
    
    &.archivedBtn {
      background: #e25656;
      color: #ffffff;
    }
  }
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export {
  ActionWrapper,
  TitleWrapper,
  ButtonHolders,
  TotalPayPrice,
  ComponentTitle,
  LocationSpan,
};

export default CompletedJobsWrapper;
