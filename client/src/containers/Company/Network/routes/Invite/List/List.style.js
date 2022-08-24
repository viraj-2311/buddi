import styled from 'styled-components';
import { palette } from 'styled-theme';

const CompanyNetworkInviteListWrapper = styled.div`
  .networkInviteStatusTab {
    .ant-tabs-content {
      padding: 15px 25px;
    }
    
    > .ant-tabs-nav {
      padding-left: 25px;
      margin-bottom: 0;
      
      .ant-tabs-tab {
        padding: 20px;
        margin: 0 25px 0 0;
      }

      .ant-tabs-tab-active {
        color: ${palette('primary', 0)};          
      }
      
      .ant-tabs-ink-bar {
        background-color: ${palette('primary', 0)};
        height: 0;
      }
    }
  }
`;

const CompanyNetworkTableWrapper = styled.div`
  width: 80%;
  
  .ant-table-thead > tr > th {
    color: #2f80ed;
    text-transform: uppercase;
  }
  
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 10px;
  }
  
  .userAvatarAndName {
    display: flex;
    align-items: center;
    
    .userAvatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    } 
  }
  
  .actions {
    button {
      margin-left: 10px;
    }
  }
`;

export { CompanyNetworkTableWrapper };

export default CompanyNetworkInviteListWrapper;
