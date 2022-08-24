import React, {useEffect, useRef, useState} from 'react';
import ImageCropWrapper from './ImageCrop.style';
import Cropper from "react-cropper";
import Spin from '@iso/components/uielements/spin';
import Button from '@iso/components/uielements/button';
import "cropperjs/dist/cropper.css";

const ImageCrop = ({ src, crop, onSave, onCancel, ...rest }) => {
  const { shape } = rest;
  const [loaded, setLoaded] = useState(false);
  const cropperRef = useRef(null);

  const handleCrop = async () => {
    const imageElement = cropperRef?.current;
    if (typeof imageElement !== "undefined") {
      const cropper = imageElement?.cropper;
      const cropImage = await getCroppedImg(cropper.getCroppedCanvas({fillColor: '#fff'}), 'test.jpeg');

      onSave(cropImage);
    }
  };

  const getCroppedImg = (canvas, fileName) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        const fileUrl = window.URL.createObjectURL(blob);
        resolve({blob, url: fileUrl});
      }, 'image/jpeg');
    });
  };

  return (
    <ImageCropWrapper>
      <div className="cropperWrapper">
        <Spin spinning={!loaded}>
          <Cropper
            className={shape}
            style={{ height: 400 }}
            initialAspectRatio={1}
            preview=".cropImagePreview"
            src={src}
            viewMode={0}
            dragMode={"move"}
            guides={false}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={true}
            responsive={true}
            autoCropArea={.8}
            cropBoxMovable={false}
            cropBoxResizable={false}
            toggleDragModeOnDblclick={false}
            checkOrientation={false}
            ref={cropperRef}
            ready={() => setLoaded(true)}
          />
        </Spin>
      </div>
      <div className="cropPreviewWrapper">
        <div className={`cropImagePreview ${shape}`}></div>
        <div className="actions">
          <Button block type="primary" shape="round" onClick={handleCrop}>Save</Button>
          <Button block type="danger" shape="round" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </ImageCropWrapper>
  )
};

ImageCrop.defaultProps = {
  crop: {
    unit: '%',
    width: 50,
    aspect: 1
  }
};

export default ImageCrop;
