import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';

const WDScheduleFullCalendarHeaderWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
  @media (max-width: 990px) {
    flex-direction: column;
  }
  
  .middleActionWrapper {
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    padding: 0 10px;
    text-align: center;
    font-size: 15px;
    
    .label {
      padding: 0 20px;
    }
  }
  
  .extraActionWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
        
    button {
      margin-right: 10px;
    }
  }
  
`;

const FullCalendarHeaderWrapper = WithDirection(WDScheduleFullCalendarHeaderWrapper);

export default FullCalendarHeaderWrapper;
