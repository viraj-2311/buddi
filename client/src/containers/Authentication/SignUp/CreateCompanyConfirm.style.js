import styled from 'styled-components';
import { palette } from 'styled-theme';
import { borderRadius } from '@iso/lib/helpers/style_utils';

const CreateCompanyConfirmWrapper = styled.div`
  .confirmTopWrapper {
    background: #ffffff;
    padding: 45px 45px 45px 95px;
        
    .benjiLogoWrapper {
      img {
        width: 145px;
      }
    }
    
    .confirmTitle {
      font-size: 30px;
      color: #000000;
    }
    
    .hintWord {
      color: ${palette('text', 4)};
    }
    
    .actions {
      margin-top: 25px;
      
      .createCompanyBtn {
        ${borderRadius('22px')};
        margin-right: 10px;
      }
    }
  }  
  
  .divider {
    width: 100%;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.45); 
  }
  
  .confirmBottomWrapper {
    background: #ffffff;
    padding: 30px 45px 45px 45px;
    
    .noteTitle {
      text-align: center;
      font-size: 18px;
    }
        
    .noteFlowWrapper {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
      
      .noteFlowText {
        font-size: 18px;
        font-weight: 600;
      }
      
      .noteFlowIconWrapper {
        margin-right: 20px;
        margin-left: 20px;
        img {
          width: 39px;
        }
      }
      
      .noteFlowBtnWrapper {      
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        button {
          ${borderRadius('22px')}
        }
        
        .btnHelperIcon {
          position: absolute;
          top: 30px;
        }
      }
    }
  }
`;

export default CreateCompanyConfirmWrapper;