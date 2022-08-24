import styled from 'styled-components';
import { palette } from 'styled-theme';

const CompanyNetworkInviteWrapper = styled.div`
  .networkSectionTab {
    .ant-tabs-content {
      margin-bottom: 40px;
    }
    
    > .ant-tabs-nav {
      background: #f5f5f5;
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
        height: 4px;
      }
    }
  }
`;

export default CompanyNetworkInviteWrapper;
