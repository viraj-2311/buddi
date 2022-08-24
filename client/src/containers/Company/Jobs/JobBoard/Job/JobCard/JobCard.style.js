import styled from "styled-components";

export const JobMoreAction = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export const JobClientName = styled.h2`
  font-size: 20px;
  color: #2f2e50;  
  font-weight: bold;
  margin-bottom: 15px;
`;

export const JobStatusBar = styled.div`
  background: ${props => props.color};
  height: 5px;
  width: 50px;
`;

export const JobTitle = styled.h4`
  margin-bottom: 20px;
`;

export const JobDetail = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0;
`;

export const JobDetailItem = styled.div`
  margin-left: 30px;
  
  &:first-child {
    margin-left: 0;
  }
  
  h3 {    
    font-weight: bold;
    font-size: 13px;
  }
  
  p {
    font-size: 13px;
  }
`;

export const JobAction = styled.div`
  margin: 0 -10px 20px;
  button.ant-btn {
    width: calc(50% - 20px);
    height: 42px;
    margin: 0 10px;
    border-radius: 50px;
  }
`;

export const JobCrew = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #2f2e50;
  font-weight: bold;
  > span,
  img {
    width: 24px;
    height: 24px;
    margin-left: 5px;
    border-radius: 50%;
  }
  .moreCrew {
    width: 24px;
    height: 24px;
    border-radius: 50px;
    background-color: ${({ color }) => `${color}`};
    color: #fff;
    text-align: center;
    font-size: 10px;
    font-weight: bold;
    line-height: 22px;
    margin-left: 5px;
  }
`;
