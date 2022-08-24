import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';

const WDScheduleFullCalendarDailyViewWrapper = styled('div')`
    
`;

const WDScheduleFullCalendarNoteListWrapper = styled.div`
  width: 100%;
  
  .noteListHeader {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    background: ${palette('color', 14)};
    
    .headerText {
      color: ${palette('text', 0)};
      text-transform: uppercase;
    }
  }
  
  .noteGroupList {
    margin-bottom: 20px;
    
    .groupHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      background: ${palette('color', 14)};
      
      .groupText {
        color: ${palette('text', 5)};
        margin-right: 25px;
      }
      
      .groupCrewList {
        flex: auto;
        
        .crewUserImg {
          width: 27px;
          height: 27px;
          margin-right: 5px;
        }
      }
    }
  }
`;

const WDScheduleFullCalendarSingleNoteWrapper = styled.div`  
  display: flex;
  flex-shrink: 0;
  justify-content: flex-start;  
  padding: 8px 10px;
  position: relative;
  
  .noteTime {
    width: 65px;
    margin-right: 10px;
  }
  
  .noteContent {
    img {
      width: 28px;
      cursor: pointer;
    }
  }
  
  .noteAction {
    position: absolute;
    top: 8px;
    right: 10px;
    
    button {
      margin-left: 5px;
    }
  }
`;

const FullCalendarDailyViewWrapper = WithDirection(WDScheduleFullCalendarDailyViewWrapper);
const FullCalendarNoteListWrapper = WithDirection(WDScheduleFullCalendarNoteListWrapper);
const FullCalendarSingleNoteWrapper = WithDirection(WDScheduleFullCalendarSingleNoteWrapper);

export { FullCalendarNoteListWrapper, FullCalendarSingleNoteWrapper };

export default FullCalendarDailyViewWrapper;
