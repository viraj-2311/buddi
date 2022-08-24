import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import { Formik, Field, Form } from 'formik';
import NumberFormat from "react-number-format";
import ZipCode from '@iso/components/shared/ZipCode';
import LocationField from '@iso/components/LocationField';
import { uploadFile } from '@iso/lib/helpers/s3';
import Button from '@iso/components/uielements/button';
import { InputField } from '@iso/components';
import DateInput from '@iso/components/DateInput';
import Input from '@iso/components/uielements/input';
import basicStyle from '@iso/assets/styles/constants';
import { maxFileUploadSize } from '@iso/config/env';
import Collapse from '@iso/components/uielements/collapse';
import ImageUpload from '@iso/components/ImageUpload/ImageUpload';
import ProfileLayout from '@iso/containers/Profile';
import ContractorProfileWrapper from './Profile.style';
import ChangePasswordForm from '@iso/containers/Profile/ChangePassword';
import SkillAndExperience from './SkillAndExperience';
import CreateCompany from '../../Authentication/SignUp/CreateCompany';
import Modal from '@iso/components/Feedback/Modal';
import ErrorComponent from '../../../components/ErrorComponent';
import SuccessText from '@iso/components/utility/successText';
import schema from './schema';
import { fetchUserDetailRequest, updateUserRequest, updateUserFail } from '@iso/redux/user/actions';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import SignUpStyleWrapper from '../../Authentication/SignUp/SignUp.styles';
import { formatDateString } from '@iso/lib/helpers/utility';

const { Panel } = Collapse;

export default () => {
  const dispatch = useDispatch();
  const { error: updateError, loading: updateLoading } = useSelector(state => state.User.update);
  const { user: authUser } = useSelector(state => state.Auth);
  const { user } = useSelector(state => state.User);
  const { locations } = useSelector(state => state.Location);

  const { rowStyle, colStyle, gutter } = basicStyle;
  const [profileImage, setProfileImage] = useState(null);
  const [originProfileImage, setOriginProfileImage] = useState(null);
  const [profile, setProfile] = useState({});
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const [visibleCreateCompany, setVisibleCreateCompany] = useState(false);

  const formikRef = useRef();

  useEffect(() => {
    if (!updateLoading && !updateError && loader) {
      setSuccessMsg('Personal profile saved successfully');
      dispatch(syncAuthUserRequest());
    }

    if (!updateLoading && loader) {
      setLoader(false);
    }
  }, [updateLoading, updateError]);

  useEffect(() => {
    dispatch(fetchUserDetailRequest(authUser.id));
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfile({
        'firstName': user.firstName || '',
        'lastName': user.lastName || '',
        'nickname': user.nickname || '',
        'email': user.email || '',
        'phone': user.phone || '',
        'birthday': formatDateString(user.birthday, 'MM/DD/YYYY'),
        'street': user.street || '',
        'zipCode': user.zipCode || '',
        'city': user.city || '',
        'state': user.state || '',
        'companyName': user.companyName || '',
        'website': user.website || '',
        'vimeo': user.vimeo || '',
        'union': user.union || ''
      });

      setProfileImage(user.profilePhotoS3Url);
      setOriginProfileImage(user.originProfilePhotoS3Url);
    }
  }, [user]);

  const handleProfileImage = (file) => {
    setProfileImage(file);
  };

  const handleOriginProfileImage = (file) => {
    setOriginProfileImage(file);
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoader(true);
      setUploadErrorMsg('');
      setSuccessMsg('');

      if (profileImage instanceof File) {
        const profileS3DirName = process.env.REACT_APP_S3_BUCKET_PROFILE_DIRNAME;
        const s3File = await uploadFile(profileImage, profileS3DirName);

        if (s3File.location) {
          values["profilePhotoS3Url"] = s3File.location;
        }
      } else {
        values["profilePhotoS3Url"] = profileImage;
      }

      if (originProfileImage instanceof File) {
        const profileS3DirName = process.env.REACT_APP_S3_BUCKET_PROFILE_DIRNAME;
        const s3OriginFile = await uploadFile(originProfileImage, profileS3DirName);

        if (s3OriginFile.location) {
          values["originProfilePhotoS3Url"] = s3OriginFile.location;
        }
      } else {
        values["originProfilePhotoS3Url"] = originProfileImage;
      }
      const birthday = formatDateString(values.birthday, 'YYYY-MM-DD')
      dispatch(updateUserRequest(user.id, { ...values, birthday }));
    } catch (error) {
      dispatch(updateUserFail(error));
      setLoader(false);
      setUploadErrorMsg('Image upload failed');
    }
  };

  const onCancelCreateCompany = () => {
    setVisibleCreateCompany(false);
  };

  const handleSuccessCompanyCreate = () => {
    dispatch(syncAuthUserRequest());
    setVisibleCreateCompany(false);
  };

  return (
    <ProfileLayout>
      <ContractorProfileWrapper>
        <Row className="section">
          <Col md={16} xs={24}>
            <h3 className="sectionTitle">Personal Profile Settings</h3>
            <div className="sectionField">
              <ImageUpload
                image={profileImage}
                originImage={originProfileImage}
                maxSize={maxFileUploadSize}
                onChange={handleProfileImage}
                onOriginChange={handleOriginProfileImage}
                shape="rounded"
              />
              {uploadErrorMsg && (
                <div className="helper-text lowercase">{uploadErrorMsg}</div>
              )}
            </div>
          </Col>
        </Row>

        <div className="createCompanyText">
          Click on <span className="hintWord">create company button</span> to create your own Production Company
          <Button type="primary" className="createCompanyBtn" onClick={() => setVisibleCreateCompany(true)}>Create Company</Button>

          <Modal
            visible={visibleCreateCompany}
            width={1050}
            footer={null}
            onCancel={onCancelCreateCompany}
            maskClosable={false}
          >
            <SignUpStyleWrapper>
              <CreateCompany user={user} onSuccess={handleSuccessCompanyCreate} />
            </SignUpStyleWrapper>
          </Modal>
        </div>

        <Row className="section">
          <Col md={16} xs={24}>
            <h3 className="sectionTitle">Information</h3>
            <div className="sectionField">
              <Formik
                enableReinitialize
                innerRef={formikRef}
                initialValues={profile}
                validationSchema={schema}
                onSubmit={handleUpdateProfile}
              >
                {({ values, touched, errors, setFieldValue }) => (
                  <Form>
                    <Row style={rowStyle} gutter={gutter} justify="start">
                      <Col md={12} sm={12} xs={24}>
                        <span className="fieldLabel required">First Name</span>
                        <Field
                          component={InputField}
                          name="firstName"
                          type="text"
                        />
                      </Col>
                      <Col md={12} sm={12} xs={24}>
                        <span className="fieldLabel required">Last Name</span>
                        <Field
                          component={InputField}
                          name="lastName"
                          type="text"
                        />
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <span className="fieldLabel required">Email</span>
                        <Field
                          component={InputField}
                          name="email"
                          type="text"
                          onChange={(e) => setFieldValue('email', e.target.value.replace(/\s/g, ''))}
                        />
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <span className="fieldLabel required">Phone</span>
                        <Field name="phone">
                          {() => (
                            <NumberFormat
                              customInput={Input}
                              format="+1 (###) ###-####"
                              mask="_"
                              value={values.phone}
                              onValueChange={(phone) => setFieldValue('phone', phone.value)}
                            />
                          )}
                        </Field>
                        {touched.phone && errors.phone && (
                          <div className="helper-text lowercase">{errors.phone}</div>
                        )}
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <span className="fieldLabel">Nickname</span>
                        <Field
                          component={InputField}
                          name="nickname"
                          type="text"
                        />
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <span className="fieldLabel required">Date of Birth</span>
                        <DateInput inputValue={values.birthday}
                          onChangeDateInput={(date) => setFieldValue('birthday', date)} />
                        {touched.birthday && errors.birthday && (
                          <div className="helper-text lowercase">{errors.birthday}</div>
                        )}
                      </Col>
                      <Col md={16} sm={12} xs={24}>
                        <span className="fieldLabel">Company Name</span>
                        <Field
                          component={InputField}
                          name="companyName"
                          type="text"
                        />
                      </Col>
                      <Col md={24} sm={24} xs={24}>
                        <span className="fieldLabel required">Home Address</span>
                        <Field
                          component={InputField}
                          name="street"
                          type="text"
                        />
                      </Col>
                      <Col md={18} sm={12} xs={24}>
                        <span className="fieldLabel required">City</span>
                        <Field
                          name="city"
                        >
                          {() => (
                            <LocationField
                              value={values.city}
                              locations={locations.city}
                              onChange={(city) => setFieldValue('city', city)}
                            />
                          )}
                        </Field>
                        {touched.city && errors.city && (
                          <div className="helper-text lowercase">{errors.city}</div>
                        )}
                      </Col>
                      <Col md={3} sm={6} xs={24}>
                        <span className="fieldLabel required">State</span>
                        <Field>
                          {() => (
                            <LocationField
                              value={values.state}
                              locations={locations.state}
                              onChange={(state) => setFieldValue('state', state)}
                            />
                          )}
                        </Field>
                        {touched.state && errors.state && (
                          <div className="helper-text lowercase">{errors.state}</div>
                        )}
                      </Col>
                      <Col md={3} sm={6} xs={24}>
                        <span className="fieldLabel required">Zip</span>
                        <Field name="zipCode">
                          {() => (
                            <ZipCode value={values.zipCode} onChange={(zipCode) => setFieldValue('zipCode', zipCode)} />
                          )}
                        </Field>
                        {touched.zipCode && errors.zipCode && (
                          <div className="helper-text lowercase">{errors.zipCode}</div>
                        )}
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <span className="fieldLabel">Union Number</span>
                        <Field
                          component={InputField}
                          name="union"
                          type="text"
                        />
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <span className="fieldLabel">Website</span>
                        <Field
                          component={InputField}
                          name="website"
                          type="text"
                        />
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <span className="fieldLabel">Vimeo</span>
                        <Field
                          component={InputField}
                          name="vimeo"
                          type="text"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} sm={12} xs={24}>
                        {!loader && updateError && <ErrorComponent error={updateError} />}
                        {successMsg && <SuccessText text={successMsg} />}
                        <Button htmlType="submit" type="primary" loading={loader}>Save</Button>
                        <Button style={{ marginLeft: '10px' }}>Cancel</Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </Col>
        </Row>

        <Collapse
          bordered={false}
          className="settingsSectionCollapse"
        >
          <Panel
            key="skills-experience-section"
            header="Add Skills and Experience"
            className="settingsSectionPanel"
          >
            <SkillAndExperience user={user} />
          </Panel>

          <Panel
            key="change-password-section"
            header="Change Password"
            className="settingsSectionPanel"
          >
            <Row className="section">
              <Col md={16} xs={24}>
                <div className="sectionField">
                  <ChangePasswordForm user={profile} />
                </div>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </ContractorProfileWrapper>
    </ProfileLayout>
  );
}
