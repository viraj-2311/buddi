import styled from 'styled-components';

const TimePickerWrapper = styled.div`;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  
  .timeInputWrapper {
    margin-right: 15px;
    min-width: 60px;
    
    .ant-input {
      height: 35px;
    }
  }
  
  .amPMWrapper {
     min-width: 140px;
  }
`;

export default TimePickerWrapper