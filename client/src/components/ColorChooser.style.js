import styled from 'styled-components';
import { palette } from 'styled-theme';
import { borderRadius } from '@iso/lib/helpers/style_utils';
import WithDirection from '@iso/lib/helpers/rtl';

const ColorChooserWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
   
  .ant-btn {
    width: 20px;
    height: 20px;
    border: 0;
    outline: 0;
    padding: 0;
    margin: ${(props) =>
      props['data-rtl'] === 'rtl' ? '0 0 15px 5px' : '0 5px 15px 0'};
    ${borderRadius('50%')};
    border: 1px solid ${palette('border', 6)};
    
    &.selected {
      box-shadow: 0 0 4px;      
    }
    
    &:empty {
      visibility: visible;
      width: 20px;
    }   
    
    &.actionBtn {
      border: 1px solid #e0e0e0;
      line-height: 1.33;
      margin: 0;
    }
  }
`;

export default WithDirection(ColorChooserWrapper);
