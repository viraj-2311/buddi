import styled from 'styled-components';
import { palette } from 'styled-theme';

const AntCalendar = ComponentName => styled(ComponentName)`
  &.ant-picker-calendar-full {
    .ant-picker-panel {
      text-align: center;
      
      table.ant-picker-content {
        border: 1px solid ${palette('color', 14)};
        border-spacing: 0;
        
        thead {
          > tr {
            > th {
              font-weight: 500;
              background: ${palette('color', 14)};
              border-bottom: 1px solid ${palette('color', 14)};
              padding: 8px;
            }
          }
        }
        
        tbody {
          > tr {
            > td {
              border-bottom: 1px solid ${palette('color', 14)};
              border-right: 1px solid ${palette('color', 14)};
            }
          }
        }
      }
      
      .ant-picker-calendar-date {
        border: none;
        margin: 0;
      }
    }
  }
  
  .highlight {
    background: #bdbdbd;
  }
  
`;

export default AntCalendar;
