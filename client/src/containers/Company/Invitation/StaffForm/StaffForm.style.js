import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import { palette } from "styled-theme";

const StaffInvitationFormWrapper = styled.div`
  .staffWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .staffInfo {
      width: calc(100% - 30px);
    }
  }
  
  .helper-text {
    color: #eb5757;
  }

  .ant-btn-link {
    color: #f48d3a;
  }
  
  .server-message {
    &.error {
      color: #eb5757;
    }
    &.success {
      color: #27ae60;
    }
  }
  
  .formGroup {
    margin-bottom: 10px;
  
    .fieldLabel {
      display: block;
      
      &.required::after {
        content: '*';
        color: #eb5757;
      }
    }
  }
  
  
`;

export default WithDirection(StaffInvitationFormWrapper);
