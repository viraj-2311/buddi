import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceReceiptFormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  input[type='file'] {
    display: none;
  }

  .dropzoneWrapper {
    width: 175px;
    height: 215px;
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 30px;

    .imagePreview {
      width: 100%;
      height: auto;
    }

    .dropzone {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border: 1px dashed #a3a0fb;
      border-radius: 10px;
      background: #f0f0f7;
      outline: none;
      cursor: pointer;

      p {
        text-align: center;
        font-size: 13px;
      }
    }
  }

  .formWrapper {
    flex: 1;
    margin-top: 30px;
    @media only screen and (min-width: 768px) {
      min-width: 365px;
    }
    .receive-content {
      flex-wrap: wrap;

      .formGroup {
        display: block;
        min-width: 200px;

        &:not(:last-child) {
          margin-bottom: 25px;
        }
      }
    }
    .chooseImageText {
      font-size: 15px;
    }

    .helperTextWrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 10px;

      .helperText {
        color: #2f2e50;
        font-size: 13px;
        font-style: italic;
        margin-right: 5px;
      }
    }

    .actions {
      button {
        margin-right: 10px;
        height: 42px;
        width: 140px;
        margin-top: 15px;
      }
    }

    .submitBtnWrapper {
      min-width: 120px;
    }
  }

  .errorText {
    color: #eb5757;
  }
`;

const ImageCropModalBodyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;

  .imagePreviewWrapper {
    width: 30%;
    margin-left: 20px;

    img {
      width: 100%;
      border: 1px solid ${palette('border', 0)};
    }

    .actions {
      margin-top: 15px;

      button {
        margin-bottom: 10px;
      }
    }
  }
`;

export { ImageCropModalBodyWrapper };

export default InvoiceReceiptFormWrapper;
