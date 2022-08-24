import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const WDWrappedJobDetailWrapper = styled.div`
  width: 100%;
  padding: 15px 25px;
  border-bottom: 2px solid ${palette('border', 7)}; 
    
  .jobContentWrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-left: 20px;
    
    .leftContent {
      margin-left: 20px;
      
      .jobTitle {
        font-size: 18px;
        color: #2f80ed;
        margin-bottom: 15px;
        
        button {
          margin-left: 15px;
        }
      }
      
      .jobText {
        font-size: 14px;
        line-height: 1.36;
        display: flex;
        margin-bottom: 20px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .inlineText {
          display: flex;
          align-items: center;
          margin-right: 20px;
        }
        
        .blockText {
          margin-right: 40px;
        }
      }
    }
    
    .middleContent {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .rightContent {
      width: 170px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .crewActualInput {
        background: #27ae60;
        color: #ffffff;
        
        input {
          padding: 5px 25px;
          color: #ffffff;
        }
      }
    }
  }
  
  .jobDateWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    @media (max-width: 575px) {
      display:block;
    }
    
    .jobDateText {
      margin-right: 15px;
      @media (max-width: 575px) {
        margin-right: 0px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
`;

export default WithDirection(WDWrappedJobDetailWrapper);