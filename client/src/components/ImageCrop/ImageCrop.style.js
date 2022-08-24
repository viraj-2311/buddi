import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const ImageCropWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  
  .cropperWrapper {
    width: calc(100% - 150px);
  
    .ReactCrop {
      img {
        width: 100%;
        height: auto;
      }
    }
  
    .rounded {
      .cropper-crop-box, .cropper-view-box {
        border-radius: 50%;
      }
      
      .cropper-view-box {
          box-shadow: 0 0 0 1px #39f;
          outline: 0;
      }
    }
    .cropper-face {
      background-color: transparent;
    }
  }
  
  .cropPreviewWrapper {
    width: 150px;
    margin-left: 20px;
    
    .cropImagePreview {
      width: 100%;
      height: 150px;
      border: 1px solid ${palette('border', 0)};
      overflow: hidden;

      &.rounded {
        border-radius: 50%;
      }      
    }
    
    .actions {
      margin-top: 15px;
      
      button {
        margin-bottom: 10px;
      }
    }
  }

  .ant-spin-nested-loading {
    width: 100%;
  }
`;

export default WithDirection(ImageCropWrapper);