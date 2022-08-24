import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUploadNew from '@iso/components/ImageUploadNew/ImageUploadNew';
import Button from '@iso/components/uielements/button';
import {maxFileUploadSize} from '@iso/config/env';
import { uploadFile } from '@iso/lib/helpers/s3';
import PersonalPhotoUploadStyleWrapper from './PersonalPhotoUpload.styles';
import { updateWizardUserRequest } from '@iso/redux/accountWizard/actions';

export default ({title, subTitle, onSuccess, onSkip}) => {
  const dispatch = useDispatch();
  const { wizard } = useSelector(state => state.AccountWizard);
  const { user: authUser } = useSelector(state => state.Auth);

  const [profileImage, setProfileImage] = useState(null);
  const [originProfileImage, setOriginProfileImage] = useState(null);
  const [isImageUploadFailed, setIsImageUploadFailed] = useState(false);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (!wizard.loading && !wizard.error && action === 'update_user') {
      onSuccess();
    }

    if (!wizard.loading && action === 'update_user') {
      setAction('');
    }
  }, [wizard]);

  useEffect(() => {
    setProfileImage(authUser.profilePhotoS3Url);
    setOriginProfileImage(authUser.originProfilePhotoS3Url);
  }, [authUser]);

  const onProfileImageChange = (file) => {
    setProfileImage(file);
  };

  const onOriginProfileImageChange = (file) => {
    setOriginProfileImage(file);
  };

  const handleConfirm = async () => {
    setAction('update_user');
    try {
      let payload = {};
      const profileS3DirName = process.env.REACT_APP_S3_BUCKET_PROFILE_DIRNAME;
      if (profileImage instanceof File) {
        const s3File = await uploadFile(profileImage, profileS3DirName);
        payload.profilePhotoS3Url = s3File.location;
      } else {
        payload.profilePhotoS3Url = profileImage;
      }

      if (originProfileImage instanceof File) {
        const s3File = await uploadFile(originProfileImage, profileS3DirName);
        payload.originProfilePhotoS3Url =  s3File.location
      } else {
        payload.originProfilePhotoS3Url = originProfileImage
      }
      dispatch(updateWizardUserRequest(authUser.id, payload));
    } catch (e) {
      setIsImageUploadFailed('Image upload failed');
      setAction('');
    }
  };


  return (
    <PersonalPhotoUploadStyleWrapper>
      <h1>{title}</h1>
      <div className="white-box">
        <h2>{subTitle}</h2>
        <div className="uploadWrapper">
          <ImageUploadNew
            image={profileImage}
            originImage={originProfileImage}
            maxSize={maxFileUploadSize}
            onChange={onProfileImageChange}
            onOriginChange={onOriginProfileImageChange}
            shape="rounded"
          />
          {isImageUploadFailed && (
            <div className="helper-text lowercase">Uploading Image Failed</div>
          )}
        </div>
        <div className="btnWrapper">
          {onSkip &&
            <Button
              className="wizardBtn"
              shape="round"
              onClick={onSkip}
              disabled={action === 'update_user'}
            >
              Skip
            </Button>
          }
          <Button
            className="wizardBtn"
            htmlType="submit"
            shape="round"
            type="primary"
            onClick={handleConfirm}
            loading={action === 'update_user'}
          >
            Confirm
          </Button>
        </div>
      </div>
    </PersonalPhotoUploadStyleWrapper>
  )
}
