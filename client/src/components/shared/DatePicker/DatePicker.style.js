import styled from 'styled-components';

const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  flex-wrap: nowrap;
  
  .monthWrapper {
    margin-right: 5px;
    min-width: 70px;
    flex: 1;
  }
  
  .dayWrapper {
    margin-right: 5px;
    min-width: 60px;
    flex: 1;
  }
  
  .yearWrapper {
     min-width: 60px;
     flex: 1;
  }
`;

export default DatePickerWrapper;