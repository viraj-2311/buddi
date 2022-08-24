import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'antd';
import Dropzone from '@iso/components/uielements/dropzone';
import Button from '@iso/components/uielements/button';
import Empty_Avatar from '@iso/assets/images/avatar.png';
import ImageUploadWrapper, { ImageCropModalBodyWrapper } from './ImageUpload.style';
import ImageCrop from '@iso/components/ImageCrop';
import Modal from '@iso/components/Feedback/Modal'
import { maxFileUploadSize } from '../../config/env';
import _ from 'lodash';

const ImageUpload = ({image, originImage, maxSize, onChange, onOriginChange, helperText, shape, isCrop}) => {
  const [isFileExceeded, setIsFileExceeded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [originImageSrc, setOriginImageSrc] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [visibleCropper, setVisibleCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (_.isObject(image)) {
      getImageBlob(image, (image) => {
        setImageSrc(image);
      });
    } else {
      if ( !croppedImage && image ) { 
        setCroppedImage({
          url: image
        });
        const filename = getFileName(image);
        setFileName(filename);
      }
      setImageSrc(image);
    }
  }, [image]);

  useEffect(() => {
    if (_.isObject(originImage)) {
      getImageBlob(originImage, (originImage) => {
        setOriginImageSrc(originImage);
      });
    } else {
      setOriginImageSrc(originImage);
      if ( !cropImageSrc && originImage ) { 
        setCropImageSrc(originImage);
      }
    }
  }, [originImage]);

  const getFileName = (url) => {
    let pieces = url.split('/');
    const name = pieces[pieces.length - 1];
    return name;
  };

  const filePicker = useRef(null);

  const openFilePicker = () => {
    filePicker.current.value = null;
    filePicker.current.click();
  };

  const getImageBlob = (file, callback) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      callback(fileReader.result);
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  };

  const onFileLoad = (files) => {
    const file = files[0];

    const size = file.size;
    if (size > maxSize) {
      setIsFileExceeded(true);
      return;
    } else {
      setIsFileExceeded(false);
    }

    setCroppedImage(null);
    setFileName(file.name);
    getImageBlob(file, (image) => {
      if (isCrop) {
        setCropImageSrc(image);
        setVisibleCropper(true);

        if (typeof onOriginChange !== 'undefined' ) onOriginChange(file);
      } else {
        setImageSrc(image);
      }
    });
  };

  const onDelete = () => {
    setImageSrc(null);
    onChange(null);
    if (typeof onOriginChange !== 'undefined' ) onOriginChange(null);
    setCroppedImage(null);
  };

  const handleCropImage = (cropImage) => {
    setCroppedImage(cropImage);
    setImageSrc(cropImage.url);
    setVisibleCropper(false);
    const file = new File([cropImage.blob], `cropped-${fileName}`);

    onChange(file);
  };

  const cancelCropImage = () => {
    setVisibleCropper(false);
    if ( isCrop && !image ) {
      setCropImageSrc(null);
    }
  };

  return (
    <ImageUploadWrapper>
      <Row gutter={[20, 10]} justify="start">
        <Col>
          <Dropzone multiple={false} onDrop={(files) => onFileLoad(files)}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps({className: `profile-photo-wrapper ${shape}`})}>
                {!croppedImage && <input {...getInputProps()} /> }
                <img
                  onClick={() => croppedImage ? setVisibleCropper(true) : null}
                  src={(imageSrc ? imageSrc : Empty_Avatar)}
                  alt="Preview"
                  className={(imageSrc ? "profile-photo": "empty-photo")}
                />
              </div>
            )}
          </Dropzone>

        </Col>
        <Col>
          <div>
            <p style={{ marginBottom: '10px' }}>{helperText}</p>
            {maxSize && <p style={{ marginBottom: '10px' }} className="italic-text">Maximum file size 20MB</p>}
            <input accept="image/*" name="photo" ref={filePicker} type="file" onChange={(e) => onFileLoad(e.target.files)} />
            <Button type="primary" onClick={openFilePicker}>Browse</Button>
            <Button style={{marginLeft: '5px'}} onClick={onDelete}>Delete</Button>
          </div>
        </Col>
      </Row>

      {isFileExceeded && (
        <div className="helper-text lowercase">File Size should not be more than 2MB.</div>
      )}

      {isCrop && (
        <Modal
          visible={visibleCropper}
          closable={false}
          width={620}
          footer={null}
        >
          <ImageCropModalBodyWrapper>
            <ImageCrop
              className="imageCropper"
              ruleOfThirds
              src={cropImageSrc}
              shape={shape}
              onSave={handleCropImage}
              onCancel={cancelCropImage}
            />
          </ImageCropModalBodyWrapper>
        </Modal>
      )}
    </ImageUploadWrapper>
  );
};

ImageUpload.defaultProps = {
  isCrop: true,
  maxSize: maxFileUploadSize,
  helperText: 'Choose an image from your computer'
};

export default ImageUpload;
