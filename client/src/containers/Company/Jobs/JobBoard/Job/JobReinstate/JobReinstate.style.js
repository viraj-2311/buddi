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
`;

