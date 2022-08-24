import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'antd';
import Dropzone from '@iso/components/uielements/dropzone';
import Button from '@iso/components/uielements/button';
import Empty_Avatar from '@iso/assets/images/avatar_1.svg';
import ImageUploadNewWrapper, {
  ImageCropModalBodyWrapper,
} from './ImageUploadNew.style';
import ImageCrop from '@iso/components/ImageCrop';
import Modal from '@iso/components/Feedback/Modal';
import { maxFileUploadSize } from '../../config/env';
import _ from 'lodash';

const ImageUploadNew = ({
  image,
  originImage,
  maxSize,
  onChange,
  onOriginChange,
  helperImage,
  helperText,
  shape,
  isCrop,
}) => {
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
      if (!croppedImage && image) {
        setCroppedImage({
          url: image,
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
      if (!cropImageSrc && originImage) {
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

        if (typeof onOriginChange !== 'undefined') onOriginChange(file);
      } else {
        setImageSrc(image);
      }
    });
  };

  const onDelete = () => {
    setImageSrc(null);
    onChange(null);
    if (typeof onOriginChange !== 'undefined') onOriginChange(null);
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
    if (isCrop && !image) {
      setCropImageSrc(null);
    }
  };

  return (
    <ImageUploadNewWrapper>
      <Row gutter={[20, 10]} justify='center'>
        <Col>
          <Dropzone multiple={false} onDrop={(files) => onFileLoad(files)}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps({
                  className: `profile-photo-wrapper ${shape}`,
                })}
              >
                {!croppedImage && <input {...getInputProps()} />}
                <img
                  onClick={() =>
                    croppedImage ? setVisibleCropper(true) : null
                  }
                  src={imageSrc ? imageSrc : helperImage}
                  alt='Preview'
                  className={imageSrc ? 'profile-photo' : 'empty-photo'}
                />
              </div>
            )}
          </Dropzone>
        </Col>
        <Col>
          <div class='upload-instruction-wrapper'>
            <p style={{ marginBottom: '10px' }}>{helperText}</p>
            {maxSize && (
              <p style={{ marginBottom: '10px' }} className='italic-text'>
                Maximum file size 20MB, PDF or JPEG
              </p>
            )}
            <input
              accept='image/*'
              name='photo'
              ref={filePicker}
              type='file'
              onChange={(e) => onFileLoad(e.target.files)}
            />
            <div>
              <Button
                className='browse-btn'
                shape='round'
                type='primary'
                onClick={openFilePicker}
              >
                Browse
              </Button>
              <Button className='delete-btn' shape='round' onClick={onDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {isFileExceeded && (
        <div className='helper-text lowercase'>
          File Size should not be more than 2MB.
        </div>
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
              className='imageCropper'
              ruleOfThirds
              src={cropImageSrc}
              shape={shape}
              onSave={handleCropImage}
              onCancel={cancelCropImage}
            />
          </ImageCropModalBodyWrapper>
        </Modal>
      )}
    </ImageUploadNewWrapper>
  );
};

ImageUploadNew.defaultProps = {
  isCrop: true,
  maxSize: maxFileUploadSize,
  helperImage: Empty_Avatar,
  helperText: 'Choose a file from your computer',
};

export default ImageUploadNew;
