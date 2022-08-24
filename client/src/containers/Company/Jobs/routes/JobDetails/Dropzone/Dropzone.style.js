import styled from 'styled-components';
import { palette } from 'styled-theme';
import {
  borderRadius,
  boxShadow,
  transition,
} from '@iso/lib/helpers/style_utils';

const DropzoneWrapper = styled.div`
  width: 100%;
  
  .filepicker {
    width: 100%;
    min-height: 340px;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    background-color: #ffffff;
    border: 2px dashed #bdbdbd;
    text-align: center;
    ${borderRadius('0')};
    
    .dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      
      .descriptionText {
        font-size: 18px;
        color: #828282;
        line-height: 25px;
        margin-bottom: 10px;
      }
      
      .dialogButton {
        width: 170px;
        height: 50px;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .helperText {
        font-size: 14px;
        color: #828282;
      }
    }
  }
`;

export default DropzoneWrapper;
