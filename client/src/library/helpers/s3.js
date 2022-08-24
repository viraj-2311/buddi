import S3FileUpload from 'react-s3';
import 'whatwg-fetch';
import fileDownload from 'js-file-download';
import { s3BucketConfig } from '@iso/config/env';

export const uploadFile = async (file, dirName) => {
  try {
    const config = {
      ...s3BucketConfig,
      dirName: dirName,
    };
    const newFile = new File([file], `${Date.now()}_${file.name}`, {
      type: file.type,
    });
    const data = await S3FileUpload.uploadFile(newFile, config);

    return { location: data.location, error: null };
  } catch (error) {
    return { location: null, error: error.message };
  }
};

export const downloadFile = async (url, fileName) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    const downloaded = await response.arrayBuffer();
    fileDownload(downloaded, fileName);
  } catch (e) {
    console.log(e);
  }
};
