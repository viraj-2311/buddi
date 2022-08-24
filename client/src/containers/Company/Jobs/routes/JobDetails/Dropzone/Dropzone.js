import React, { createRef } from 'react';
import Dropzone from '@iso/components/uielements/dropzone';
import Button from '@iso/components/uielements/button';
import DropzoneWrapper from './Dropzone.style';
import Upload from '@iso/assets/images/upload.svg'

export default ({onSelect, ...rest}) => {
  const dropzoneRef = createRef();

  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open()
    }
  };

  const handleUpload = (files) => {
    onSelect(files)
  };

  return (
    <DropzoneWrapper>
      <Dropzone ref={dropzoneRef} noKeyboard onDrop={handleUpload} {...rest}>
        {({getRootProps, getInputProps}) => (
          <div className="filepicker">
            <div
              {...getRootProps({
                className: 'dropzone'
              })}
            >
              <input {...getInputProps()} />
              <img src={Upload} width={94} />
              <p className="descriptionText">Drag & Drop files here<br/>or</p>
              <Button size="large" onClick={openDialog} className="dialogButton">Browse Files</Button>
              <p className="helperText">Maximum file size 20MB, PDF or JPEG</p>
            </div>
          </div>
        )}
      </Dropzone>
    </DropzoneWrapper>
  );
};
