import styled from 'styled-components';
import { Checkbox } from 'antd';

const AntCheckbox = styled(Checkbox)`
  &.ant-checkbox-wrapper {
    .ant-checkbox {
      position: relative;
      top: -1px;
  
      &:after {
        display: none;
      }
      
      .ant-checkbox-inner {
        width: 18px;
        height: 18px;
        background-color: transparent;
        border: solid 2px #d9d9e2;
      }
      
      &.ant-checkbox-checked {
        .ant-checkbox-inner {
          background-color: ${props => props.color || '#ffffff'};
          border-color: transparent;
        }
      }
    }
  }
`;

export default AntCheckbox;
