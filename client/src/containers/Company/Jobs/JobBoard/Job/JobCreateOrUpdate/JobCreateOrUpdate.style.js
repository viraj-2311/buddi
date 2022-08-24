import styled from 'styled-components';
import { palette } from 'styled-theme';

export const JobFormWrapper = styled.div`
  .fieldLabel {
    color: #868698;
  }
  
  .userDropdownItemWithAvatar {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    .userAvatar {
      margin-right: 15px;
      
      img {
        width: 30px;
        height: 30px;
      }
    }
    
    .userInfo {
      .userStatus {
        color: ${palette('error', 0)};
        font-size: 12px;
        font-style: italic;
        line-height: 1.33;
      }
    }
  }  

  .formGroup{
    .ant-picker-focused{
      border: 1px solid ${palette('themecolor', 0)} !important;
      box-shadow:none !important;
    }
  }

  input, .ant-picker{
    &:focus {
      border-color: ${palette('themecolor', 0)} !important;
      box-shadow:none !important;
    }
  }
 
  .ant-picker, .ant-timepicker {
    padding: 0 15px;
    width: 100%;
    height: 50px;
    cursor: text;
    font-size: 15px;
    line-height: 1.5;
    color: ${palette('text', 1)};
    background-color: ${palette('background', 1)};
    border-radius: 5px !important;
    border-color:#bcbccb !important;
    &:hover{
      border-color: inherit;
    }
  }
  .job-create-action{
    border-top: 0;
    padding-top: 0;
    display: flex;
    justify-content: space-between;
     button{
       width:46%;
        &:first-child{
          margin-left:0;
        }
     }
  }

  .ant-select {
    width: 100%;
  }
`;

