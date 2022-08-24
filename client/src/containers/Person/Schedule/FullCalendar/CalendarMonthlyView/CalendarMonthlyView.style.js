import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';

const WDScheduleFullCalendarMonthlyViewWrapper = styled('div')`
  .singleEventNote {
    width: 100%;
    padding: 5px 6px;
    margin: 0;
    color: #ffffff;
    cursor: pointer;
    text-align: left;
    margin-bottom: 5px;
    ${borderRadius('2px')}
    
    .noteInfos {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      
      .companyTitle {
        display: block;
        font-size: 10px;
      }
    }
  }
  
`;

const FullCalendarMonthlyViewWrapper = WithDirection(WDScheduleFullCalendarMonthlyViewWrapper);

export default FullCalendarMonthlyViewWrapper;
