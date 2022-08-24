import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.h4`
  margin: 0;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  font-size: 25px;
  color: ${palette('text', 5)};
  font-weight: bold;
`;
