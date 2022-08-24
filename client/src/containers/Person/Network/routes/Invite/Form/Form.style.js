import styled from 'styled-components';

const PersonalNetworkInviteFormWrapper = styled.div`
  width: 100%;
  max-width: 775px;
  margin: 50px auto 25px;
  
  .formHeader {
    text-align: center;
    margin-bottom: 25px;
    
    .title {
      font-size: 40px;
      font-weight: normal;      
    }
    
    .subTitle {
      color: #828282;
      font-size: 14px;
    }
  }
    
  .server-message {
    &.error {
      color: #eb5757;
    }
    &.success {
      color: #27ae60;
    }
  }
  
  .helper-text {
    color: #eb5757;
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

export default PersonalNetworkInviteFormWrapper;
