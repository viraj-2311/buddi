import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDCallsheetDetailWrapper = styled.div`
  width: 100%;
  padding: 20px;
  
  .divider {
    margin: 15px -20px;
    border: 2px solid #e0e0e0;
  }
  
  .infoLabel {
    min-width: 135px !important;
  }
  
  .buttonWrapper {
    margin-left: 160px;
    
    .callsheeetLabel {
      height: 36px;
      line-height: 1.5;
      padding: 0 25px;
      font-size: 14px;
    }
  }  
`;

export default WithDirection(WDCallsheetDetailWrapper);
