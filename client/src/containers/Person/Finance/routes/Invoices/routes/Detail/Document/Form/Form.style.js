import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceDocumentFormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 25px;
  flex-wrap: wrap;

  input[type='file'] {
    display: none;
  }

  .dropzoneWrapper {
    width: 175px;
    height: 211px;
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
    margin-top: 30px;
    flex: 1;
    @media only screen and (min-width: 768px) {
      min-width: 365px;
    }

    .formGroup {
      display: block;

      &:not(:last-child) {
        margin-bottom: 25px;
      }
    }

    .helperTextWrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 10px;

      .helperText {
        color: #828282;
        font-style: italic;
        margin-right: 5px;
      }
    }

    .actions {
      button {
        margin-top: 10px;
        margin-right: 10px;
        height: 42px;
        width: 140px;
      }
    }

    .submitBtnWrapper {
      min-width: 120px;
      max-width: 150px;
    }
    .document-title {
      min-width: 120px;
    }
    .amount {
      min-width: 120px;
    }
    .notes {
      min-width: 205px;
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

export default InvoiceDocumentFormWrapper;
