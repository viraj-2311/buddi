import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import {borderRadius} from '@iso/lib/helpers/style_utils';

const WDScheduleFullCalendarWeeklyViewWrapper = styled.div`
  .ant-table {
    table {
      border-spacing: 0;
      table-layout: fixed;
      border-collapse: collapse;
      
      thead {
        tr {
          border: 1px solid #f2f2f2;
          
          th {
            text-align: center;
            font-size: 14px;
            color: #333333;
            font-weight: normal;
            padding: 5px;
            width: 36px;
          }
        }
      }
      tbody {
        &:before {
          content: '';
          display: block;
          height: 15px;
        }
        
        tr {
          border: 1px solid #f2f2f2;
                      
          td {
            border-right: 1px solid #f2f2f2;
            min-width: 24px;
            padding: 4px 4px 4px 1px;
            
            .calendar-date-content {
              width: auto;
              height: auto;
              overflow-y: auto;
              color: rgba(0,0,0,.85);
              line-height: 1.5715;
              text-align: left;
              ${borderRadius('2px')}
              
              .singleEventNote {
                width: 100%;
                padding: 5px 6px;
                margin: 0;
                color: #ffffff;
                cursor: pointer;
                text-align: left;
                border-radius: 2px;
                margin-bottom: 5px;
                
                .noteInfos {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  
                  .companyTitle {
                    font-size: 10px;
                    display: block;
                  }
                }
              }
            }
          }
        } 
      }
    }
  }  
`;

const FullCalendarWeeklyViewWrapper = WithDirection(WDScheduleFullCalendarWeeklyViewWrapper);
export default FullCalendarWeeklyViewWrapper;
