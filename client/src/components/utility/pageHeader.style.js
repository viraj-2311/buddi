import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const WDComponentTitleWrapper = styled.div`
  width: 100%;
  background-color: ${palette('background', 0)};  
  padding: 14px 25px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  
  .title {
    color: ${palette('text', 5)};
    font-size: 18px;
    font-weight: 500;
  }

  @media only screen and (max-width: 767px) {
    margin: 0 10px;
    margin-bottom: 30px;
  }  
`;

const ComponentTitleWrapper = WithDirection(WDComponentTitleWrapper);
export { ComponentTitleWrapper };
