import styled from 'styled-components';
import { palette } from 'styled-theme';

const EmptyComponent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  h2 {
    font-size: 21px;
    font-weight: 600;
    color: #333333;
    line-height: 1.5;
  }
`;

export { EmptyComponent };
