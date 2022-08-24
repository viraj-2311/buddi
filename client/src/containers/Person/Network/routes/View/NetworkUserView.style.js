import styled from 'styled-components';
import { palette } from 'styled-theme';

const PersonalNetworkUserViewWrapper = styled.div`
  width: 100%;  
  padding: 25px;
  
  .profileTopHeader {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    
    .personImage {
      width: 225px;
      height: 225px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 15px;
      
      img {
        width: 100%;
      }
    }
    
    .personInfoWrapper {
      .personName {
        font-size: 32px;
        font-weight: 600;
        
      }
      
      .personRole {
        font-size: 21px;
        color: #828282;
      }
      
      .personLocation {
        font-style: italic;
        color: #828282;
      }
      
      .personExtraInfo {
        margin-top: 10px;
      }
    }
   }
    
  .isoBoxWrapper {
    .isoBoxTitle {
      font-size: 18px;
    }
  }
      
  .educationSection {
    .schoolDetails {
      margin-bottom: 25px;
    }
  }
  
  .experienceAndSkillSection {
    .skillGroup {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .groupTitle {
        margin-bottom: 5px;
      }
    }
  }
  
  .employmentSection {
    .directorGroup {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .groupTitle {
        margin-bottom: 5px;
      }
    }
  }
  
  .pressesSection {
    .link {
      display: block;
    }
  }
`;

export default PersonalNetworkUserViewWrapper;