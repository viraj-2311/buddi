import styled from 'styled-components';
import { palette } from 'styled-theme';

const PersonalNetworkViewWrapper = styled.div`
  margin: 0 0 30px 0;
  
  .networkSearchBoxWrapper {
    border-bottom: 1px solid ${palette('border', 7)};
    
    .searchBox {
      padding: 30px;
    }    
  }
  
  .networkSortOptionWrapper {
    padding: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${palette('border', 7)};
    
    .sortLabel {
      color: #828282;
      font-weight: 600;
      margin-right: 15px;
    }
    
    .sortOption {
      border: 1px solid ${palette('border', 7)};
      border-radius: 18px;
      margin-right: 15px;
       
      &::before {
        width: 0;
      }
    }
  }
  
  .networkUserListWrapper {
    .isoEmptyComponent {
      margin-top: 20px;
    }
  }
`;

export default PersonalNetworkViewWrapper;
