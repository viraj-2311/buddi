import styled from 'styled-components';
import { palette } from 'styled-theme';

const CalendarWeeklyNoteDetailWrapper = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 18px;
    }
  }
  
  .subTitle {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 15px;
  }
  
  .noteDate {
    margin-bottom: 15px;
  }
  
  .noteInfoWrapper {
    .noteInfo {
      width: 100%;
      display: flex;
      flex-shrink: 0;
      flex-direction: row;
      margin-bottom: 10px;
      
      .noteTime {
        width: 80px;
        margin-right: 5px;
        font-weight: bold;
      }
      
      .noteContent {
        width: 100%;
        display: flex;
        align-items: flex-start;
        
        img {
          width: 28px;
          cursor: pointer;
          margin-right: 5px;
        }
      }
    }
  }
`;

export default CalendarWeeklyNoteDetailWrapper;

