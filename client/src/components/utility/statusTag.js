import styled from 'styled-components';
import { palette } from 'styled-theme';

const StatusTag = styled.span`
  padding: 5px 10px;
  height: 30px;
  min-width: 100px;
  line-height: 1.33;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${props => props.color || palette('primary', 0)};
  font-size: 13px;
  font-weight: bold;
  color: #ffffff;
  text-transform: capitalize;

  &.error {
    background-color: ${palette('error', 0)};
  }

  &.warning {
    background-color: ${palette('warning', 0)};
  }

  &.success {
    background-color: ${palette('greenScale', 0)};
  }
  
  &.primary {
    background-color: ${palette('primary', 0)};
  }
  
  &.secondary {
    background-color: ${palette('secondary', 0)};
  }

  &.ok {
    background-color: #868698;
  }
`;

export default StatusTag;