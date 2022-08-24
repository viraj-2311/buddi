import styled from 'styled-components';
import { palette } from 'styled-theme';

const AntCheckbox = ComponentName => styled(ComponentName)`
  &.ant-checkbox-wrapper {
    font-size: 14px;
    color: ${palette('text', 5)};
    
    &:hover {
      .ant-checkbox-inner {
        border-color: ${props => props.color || '#c5370f'};
      }
    }
    
    .ant-checkbox {
      .ant-checkbox-inner {
        width: 18px;
        height: 18px;
        background-color: #ffffff;
        border: solid 2px #d9d9e2;
      }
      
      &.ant-checkbox-checked {
        .ant-checkbox-inner {
          background-color: ${props => props.color || '#c5370f'};
          border-color: ${props => props.color || '#c5370f'};
        }
      }    
    }
  }
`;

export default AntCheckbox;
