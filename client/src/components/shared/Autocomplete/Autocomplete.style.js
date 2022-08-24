import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';

const AutocompleteWrapper = styled.div`
  .ant-input {
    padding: 15px;
    width: 100%;
    height: 50px;
    cursor: text;
    text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};
    font-size: 15px;
    line-height: 1.5;
    color: ${palette('text', 1)};
    background-color: ${palette('background', 1)};
    background-image: none;
    border: 1px solid ${palette('border', 8)};
    ${borderRadius('5px')};
    ${transition()};

    &:focus {
      border-color: ${palette('primary', 0)};
    }
  }
  
  .isoAutocompleteDropdown {
    width: 100%;
    max-height: 256px;
    overflow-y: auto;
    margin: 1px 0;
    cursor: pointer;
    padding: 0;
    line-height: 1.5715;
    list-style: none;
    position: absolute;
    box-sizing: border-box;
    font-size: 14px;
    font-variant: initial;
    background-color: #fff;
    border-radius: 2px;
    outline: none;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  }
`;

export default AutocompleteWrapper;
