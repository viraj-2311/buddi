import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDJobItemWrapper = styled.div`
  width: 100%;
  display: flex;
  
  .job-photo-wrapper {
    width: 100px;
    height: 100px;
    
    .empty-photo {
      width: 100px;
      height: 100px;
      border: 2px solid #E0E0E0;
      border-radius: 7px;
      margin: 0 !important;
      flex-direction: column;
      display: flex;
      justify-content: center;
    }
      
    .job-photo {
      width: 100px;
      height: 100px;
      border: 2px solid #E0E0E0;
      border-radius: 7px;
    }
    
  }
  
  .jobContent {
    width: 100%;
    margin-left: 20px;
    
    .jobTitle {
      font-size: 18px;
      line-height: 1.33;
      color: #2f80ed;
      margin-bottom: 10px;
    }
    
    .jobText {
      font-size: 14px;
      line-height: 1.36;
      display: flex;
      margin-bottom: 10px;
      
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
`;

const JobItemWrapper = WithDirection(WDJobItemWrapper);

export default JobItemWrapper;
