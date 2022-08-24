import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';

const DateInputWrapper = styled.div`
  .ant-input {
    padding: 4px 10px;
    width: 100%;
    height: 50px;
    background-color: ${palette('background', 1)};
    background-image: none;
    cursor: text;
    font-size: 15px;
    line-height: 1.5;
    color: ${palette('text', 1)};
    border: 1px solid ${palette('border', 0)};
    ${borderRadius('5px')};
    ${transition()};

    &:focus {
      border-color: ${palette('primary', 0)};
    }
  }
`;

export default DateInputWrapper;
