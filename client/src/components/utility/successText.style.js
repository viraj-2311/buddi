import styled from 'styled-components';
import { palette } from 'styled-theme';

const SuccessTextWrapper = styled.div`
  width: 100%;  
  margin-bottom: 20px;
  
  h3 {
    font-size: 14px;
    color: ${palette('success', 0)};
  }
`;

export default SuccessTextWrapper;
