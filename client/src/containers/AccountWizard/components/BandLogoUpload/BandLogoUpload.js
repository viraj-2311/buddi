import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUploadNew from '@iso/components/ImageUploadNew/ImageUploadNew';
import Button from '@iso/components/uielements/button';
import { maxFileUploadSize } from '@iso/config/env';
import { uploadFile } from '@iso/lib/helpers/s3';
import BandLogoUploadStyleWrapper from './BandLogoUpload.styles';
import { updateWizardCompanyRequest } from '@iso/redux/accountWizard/actions';
import EmptyBandLogo from '@iso/assets/images/band-logo-avatar.svg';

export default ({ title, subTitle, onSuccess, onSkip }) => {
  const dispatch = useDispatch();
  const { company, wizard } = useSelector((state) => state.AccountWizard);

  const [profileImage, setProfileImage] = useState(null);
  const [originProfileImage, setOriginProfileImage] = useState(null);
  const [isImageUploadFailed, setIsImageUploadFailed] = useState(false);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (company) {
      setProfileImage(company.profilePhotoS3Url);
      setOriginProfileImage(company.originProfilePhotoS3Url);
    }
  }, [company]);

  useEffect(() => {
    if (!wizard.loading && !wizard.error && action === 'update_band') {
      onSuccess();
    }

    if (!wizard.loading && action === 'update_band') {
      setAction('');
    }
  }, [wizard]);

  const onProfileImageChange = (file) => {
    setProfileImage(file);
  };

  const onOriginProfileImageChange = (file) => {
    setOriginProfileImage(file);
  };

  const handleConfirm = async () => {
    setAction('update_band');
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
        payload.originProfilePhotoS3Url = s3File.location;
      } else {
        payload.originProfilePhotoS3Url = originProfileImage;
      }

      dispatch(updateWizardCompanyRequest(company.id, payload));
    } catch (e) {
      setIsImageUploadFailed('Image upload failed');
      setAction('');
    }

    // TO DO: remove that onSuccess() call when actual api implementation
    onSuccess();
  };

  return (
    <BandLogoUploadStyleWrapper>
      <h1>{title}</h1>
      <div className='white-box'>
        <h2>{subTitle}</h2>
        <div className='uploadWrapper'>
          <ImageUploadNew
            image={profileImage}
            originImage={originProfileImage}
            maxSize={maxFileUploadSize}
            helperImage={EmptyBandLogo}
            onChange={onProfileImageChange}
            onOriginChange={onOriginProfileImageChange}
          />
          {isImageUploadFailed && (
            <div className='helper-text lowercase'>Uploading Image Failed</div>
          )}
        </div>
        <div className='confirmBtnWrapper'>
          {onSkip && (
            <Button
              className='wizardBtn'
              shape='round'
              onClick={onSkip}
              disabled={action === 'update_band'}
            >
              Skip
            </Button>
          )}
          <Button
            className='wizardBtn'
            htmlType='submit'
            shape='round'
            type='primary'
            onClick={handleConfirm}
            loading={action === 'update_band'}
          >
            Confirm
          </Button>
        </div>
      </div>
    </BandLogoUploadStyleWrapper>
  );
};
