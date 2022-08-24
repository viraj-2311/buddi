import styled from 'styled-components';
import { palette } from 'styled-theme';

const SinglePersonalNetworkUserWrapper = styled.div`
  width: 100%;  
  padding: 15px;
  border-bottom: 1px solid ${palette('border', 7)};
   
  .userInfoWrapper {
    display: flex;
    justify-content: flex-start;   
    
    .userAvatar {
      flex-shrink: 0;
      margin-right: 10px;
      
      img {
        width: 75px;
        height: 75px;
        border-radius: 50%;
      }
    }
    
    .userContent {
      color: #828282;
      .userName {
        font-size: 18px;
        font-weight: 600;
        
        .starredIndicator {
          margin-left: 10px;
          cursor: pointer;
          
          .starred {
            color: #ffc107;
          }  
        }      
      }
    }
  } 
  
  .actions {
    margin-top: 15px;
    display: flex;
    align-items: center;
    
    button {
      margin-right: 10px;
    }
  }
`;

export default SinglePersonalNetworkUserWrapper;