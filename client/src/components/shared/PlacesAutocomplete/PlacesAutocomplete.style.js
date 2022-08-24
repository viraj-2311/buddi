import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';

const PlacesAutocompleteWrapper = styled.div`
  position: relative;
  width: 100%;
  
  .ant-input {
    padding: 4px 10px;
    width: 100%;
    height: 35px;
    cursor: text;
    font-size: 13px;
    line-height: 1.5;
    color: ${palette('text', 1)};
    background-color: #fff;
    background-image: none;
    border: 1px solid ${palette('border', 0)};
    ${borderRadius(0)};
    ${transition()};
  }
  
  .isoAutocompleteDropdown {
    width: 100%;
    margin: 1px 0;
    cursor: pointer;
    padding: 0;
    line-height: 1.5715;
    list-style: none;
    position: absolute;
    z-index: 2;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 14px;
    font-variant: initial;
    background-color: #fff;
    border-radius: 2px;
    outline: none;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  }
`;

export default PlacesAutocompleteWrapper;