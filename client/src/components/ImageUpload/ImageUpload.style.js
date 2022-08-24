import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import {palette} from 'styled-theme';

const ImageUploadWrapper = styled.div`
  input[type="file"] {
    display: none !important;
  }
        
  .profile-photo-wrapper {
    border-radius: 7px;
    border: 2px solid #d9d9d9;
    width: 100px;
    height: 100px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    cursor: pointer;
    
    &.rounded {
      border-radius: 50%;
    }
    
    .empty-photo {
      width: 50px;
      height: 50px;
    }
    
    .profile-photo {
      width: 96px;
      height: 96px;
    }
  }
  
  .italic-text {
    font-style: italic;
  }
`;

const ImageCropModalBodyWrapper = styled.div`
  
`;

export { ImageCropModalBodyWrapper };

export default WithDirection(ImageUploadWrapper);
