import styled from 'styled-components';
import { palette } from 'styled-theme';

const SkillAndExperienceWrapper = styled.div`
  .educationSection {
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .educationItem {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .skillsSection {
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

const ProfileSectionWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid ${palette('border', 0)};
  box-shadow: 1px 5px 5px 0 ${palette('border', 0, 0.15)};
  margin: 0 0 20px;
  
  .title {
    font-size: 18px;
    font-weight: 600;
    color: ${palette('text', 0)};
    margin: 0 0 20px;
  }
  
  .sectionEditBtn {
    margin-left: 10px;
  }
`;

export { ProfileSectionWrapper }

export default SkillAndExperienceWrapper;
