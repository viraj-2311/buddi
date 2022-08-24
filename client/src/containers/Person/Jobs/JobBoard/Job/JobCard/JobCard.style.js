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

export const JobTitle = styled.h4`
  margin-bottom: 20px;
`;

export const JobStatusBar = styled.div`
  background: ${props => props.color};
  height: 5px;
  width: 50px;
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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  button.ant-btn {
    width: calc(50% - 20px);
    height: 42px;
    border-radius: 50px;
  }
  
  .badge {
    padding: 5px 7px;
    font-size: 15px;
    font-weight: bold;
    height: 30px;
    border-radius: 5px;
  }
  
  .statusBadge {
    font-size: 15px;
  }
`;
