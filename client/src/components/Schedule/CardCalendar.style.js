import styled from 'styled-components';

const ScheduleCardCalendarWrapper = styled.div`
  width: 100%;
   
  .react-calendar {
    border: none;
    
    .react-calendar__month-view {
      .react-calendar__tile {
        border-radius: 50%;
        
        &.highlight {
          background-color: #bdbdbd;
          color: #ffffff;
        }
        
        &.react-calendar__tile--active.highlight {
          background: #1087ff;
        }        
      }
    }     
  }
`;

export default ScheduleCardCalendarWrapper;
