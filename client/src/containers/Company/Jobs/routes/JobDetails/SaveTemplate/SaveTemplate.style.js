import styled from 'styled-components';
import { palette } from 'styled-theme';

const CreateCompanyModalWrapper = styled.div`
  .topFieldWrapper {
    
  }
  
  .divider {
    width: 100%;
    border: solid 1px #b4b4c6;
    margin: 40px 0;
  }
  
  .bottomFieldWrapper {
    .title {
      font-size: 20px;
      font-weight: bold;
      color: ${palette('text', 5)};
    }
    
    .templateList {
      margin-bottom: 30px;
      
      .templateItem {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 30px 0;
        border-bottom: 2px solid #b4b4c6;
        
        .templateName {
          margin-left: 15px;
          font-size: 15px;
        }
        
        .anticon {
          font-size: 20px;
          color: #ffc06a;
        }
      }
    }
  }  
  
  .actionBtnWrapper {
    text-align: right;
    
    button {
      margin-left: 20px;
      width: 160px;
    }
  }
  
  .helper-text {
    color: ${palette('error', 0)};
  }
`;

export default CreateCompanyModalWrapper;