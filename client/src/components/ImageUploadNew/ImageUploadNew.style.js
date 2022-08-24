import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const ImageUploadWrapper = styled.div`
  input[type='file'] {
    display: none !important;
  }

  .ant-row {
    align-items: center;
  }
  .upload-instruction-wrapper {
    text-align: center;
  }
  .profile-photo-wrapper {
    width: 150px;
    height: 150px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    cursor: pointer;

    &.rounded {
      .profile-photo {
        border-radius: 50%;
      }
    }

    .profile-photo {
      width: 150px;
      height: 150px;
      border-radius: 10px;
    }

    .empty-photo {
      width: 100%;
      height: 100%;
    }
  }

  .italic-text {
    font-style: italic;
  }
  button {
    width: 141px;
    height: 42px;
    background-color: #3b86ff;
    margin-bottom: 15px;
    &:first-child {
      margin-right: 10px;
    }
    &.browse-btn {
      background-color: #3b86ff;
    }
    &.delete-btn {
      border: solid 1px #43425d;
      background-color: white;
    }
  }
`;

const ImageCropModalBodyWrapper = styled.div``;

export { ImageCropModalBodyWrapper };

export default WithDirection(ImageUploadWrapper);
