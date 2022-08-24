import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDDateWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  font-size: 21px;
  line-height: 1.33;
  
  .dayNumberWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 110px;
    padding-top: 6px;
    background-color: #f2f2f2;
    margin-right: 2px;
  }
  
  .dateWrapper {
    padding: 6px 30px;
    display: flex;
    flex-direction: column;
    background-color: #f2f2f2;
  }
  
  .widgetLabel {
    font-size: 58px;
    color: #333333;
    line-height: 1.36
  }
`;

const ScheduleDetailWrapper = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 18px;
    }
    
    .actions {
      button {
        margin-left: 10px;
      }
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

const DateWidgetWrapper = WithDirection(WDDateWidgetWrapper);
export {DateWidgetWrapper, ScheduleDetailWrapper};