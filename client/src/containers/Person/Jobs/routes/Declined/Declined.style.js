import styled from 'styled-components';

const DeclinedJobsWrapper = styled.div`
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

const ComponentTitle = styled.h3`
  font-size: 30px;
  font-weight: bold;
  color: #2f2e50;
  display: inline-block;
`;

const ButtonHolders = styled.div`
  button.ant-btn {
    border: transparent;
    display: flex;
    align-items: center;
    
    span {
      margin-left: 10px;
    }

    &.deleteBtn,
    &.deleteBtn:hover {
      color: #ffffff;
      background: #e25656;
    }
  }
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    color: #f48d3a;
  }
`;

export {
  ActionWrapper,
  TitleWrapper,
  ButtonHolders,
  ComponentTitle,
  LocationSpan,
};

export default DeclinedJobsWrapper;
