import styled from 'styled-components';
import { borderRadius } from '@iso/lib/helpers/style_utils';

const ContractorScheduleWrapper = styled.div`
   width: 100%;
   padding: 25px;
  
  .scheduleMainWrapper {
    width: 100%;
    display: flex;
    
    .scheduleLeftWrapper {
      width: 240px;
      display: flex;
      flex-direction: column;
      
      .section {
        margin-bottom: 25px;
        
        .title {
          font-size: 14px;
          color: #333333;
          margin-bottom: 10px;
        }
      }
      
      .scheduleEventList {
        .scheduleEvent {
          width: 100%;
          display: flex;
          margin-bottom: 10px;
          align-items: center;
          
          .eventColorIndicator {
            display: inline-bblock;
            width: 14px;
            height: 14px;
            margin-right: 10px;
            ${borderRadius('2px')};
          }
        }
      }
    }
    
    .scheduleContentWrapper {
      width: 100%;
      margin-left: 25px;
    }
  }
   
  
`;

export default ContractorScheduleWrapper;