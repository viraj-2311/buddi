import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Card } from 'antd';

const StyledJobCard = styled(Card)`
  &.ant-card {
    border: solid 1px #e8e8f1;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;

    .ant-card-head {
      background-color: #ffffff;
      border-bottom: solid 1px #e8e8f1;
      padding: 0;
      
      .ant-card-head-title {
        font-weight: bold;
        color: #2f2e50;
        font-size: 20px;
        padding: 30px;
      }
    }
    
    .ant-card-body {
      background-color: #f5f7fa;
      padding: 30px;
    }
  }
`;

export default StyledJobCard;