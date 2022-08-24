import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceDocumentListWrapper = styled.div`
  width: 100%;
  
  .documentItem {
    height: auto;
    display: flex;
    border-radius: 10px;
    
    .documentThumb {
      width: 100px;
      height: 100px;
      margin-right: 10px;
      
      img {
        width: 100%;
      }
    }
    
    .documentText {
      p {
        margin-bottom: 10px;
      }
    }
    
    .documentAmount {
      font-size: 21px;
    }
  }
  
  .documentAction {
    position: absolute;
    right: 25px;
    display: flex;
    flex-direction: column;
    
    button {
      margin-bottom: 10px;
    }
  }
`;

export default InvoiceDocumentListWrapper;