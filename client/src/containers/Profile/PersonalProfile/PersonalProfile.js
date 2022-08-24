import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card } from 'antd';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import NumberFormat from 'react-number-format';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';

import { uploadFile } from '@iso/lib/helpers/s3';
import Button from '@iso/components/uielements/button';
import { InputField } from '@iso/components';
import DateInput from '@iso/components/DateInput';
import Input from '@iso/components/uielements/input';
import notify from '@iso/lib/helpers/notify';
import basicStyle from '@iso/assets/styles/constants';
import { maxFileUploadSize } from '@iso/config/env';
import Collapse from '@iso/components/uielements/collapse';
import ProfileLayout from '@iso/containers/Profile';
import {
  fetchUserDetailRequest,
  updateUserRequest,
  updateUserReset,
  updateUserFail,
  checkSectionToRedirect,
} from '@iso/redux/user/actions';
import ImageUploadNew from '@iso/components/ImageUploadNew/ImageUploadNew';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import { formatDateString } from '@iso/lib/helpers/utility';
import Select, { SelectOption } from '@iso/components/uielements/select';
import {
  CloseCircleFilled,
  InfoCircleFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ProfileTagAutocomplete from '@iso/containers/Profile/ProfileTagAutocomplete/ProfileTagAutocomplete';

import PersonaProfileWrapper, {
  CardWrapper,
  ErrorMessageDiv,
  FormWrapper,
  RemoveButton,
} from './PersonalProfile.style';
import schema from './schema';
import { mutateChangedUserDetail } from './utility';

const { Panel } = Collapse;

const Option = SelectOption;
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
const YEARS = () => {
  const currentYear = new Date().getFullYear();
  return _.range(currentYear, 1990, -1);
};

const tagFormattedSkills = (skills) => {
  if (!skills) return [];
  return skills.map((skill) => ({ id: skill, name: skill }));
};

const tagFormattedDirectors = (directors) => {
  if (!directors) return [];
  return directors.map((director) => ({ id: director, name: director }));
};

const tagFormattedProducers = (producers) => {
  if (!producers) return [];
  return producers.map((producer) => ({ id: producer, name: producer }));
};

const tagFormattedClients = (clients) => {
  if (!clients) return [];
  return clients.map((client) => ({ id: client, name: client }));
};

const tagFormattedCompanies = (companies) => {
  if (!companies) return [];
  return companies.map((company) => ({ id: company, name: company }));
};

const tagFormattedAgencies = (agencies) => {
  if (!agencies) return [];
  return agencies.map((agency) => ({ id: agency, name: agency }));
};

export default () => {
  const dispatch = useDispatch();

  const { error: updateError, loading: updateLoading, updated } = useSelector(
    (state) => state.User.update
  );
  const sectionToRedirect = useSelector(
    (state) => state.User.sectionToRedirect
  );
  const {
    error: expertiesUpdateError,
    loading: expertiesUpdateLoading,
    updated: is_expertiesUpdated,
  } = useSelector((state) => state.User.profile);
  const { user: authUser } = useSelector((state) => state.Auth);
  const { user } = useSelector((state) => state.User);
  const { locations } = useSelector((state) => state.Location);

  const { gutter30 } = basicStyle;

  const [profileImage, setProfileImage] = useState(null);
  const [originProfileImage, setOriginProfileImage] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '',
    nickname: '',
    jobTitle: '',
    email: '',
    birthday: '',
    phone: '',
    union: '',
    website: '',
    linkToWork: '',
  });
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const [activePanel, setActivePanel] = useState([]);
  const [hashedUrl, setHashedUrl] = useState(false);
  const [otherUserInformation, setOtherUserInformation] = useState({
    id: '',
    headline: '',
    fullName: '',
    nickname: '',
    linkToWork: '',
    website: '',
    union: '',
    jobTitle: '',
    email: '',
    phone: '',
    activeSince: { month: '', year: '' },
    birthday: new Date(),
    educations: [],
    skills: {
      primarySkills: { primarySkill: [] },
      secondarySkills: { secondarySkill: [] },
      toolsAndTechnologies: { toolAndTechnology: [] },
    },
    directors: { directors: [], directorsPhotography: [] },
    producers: { producers: [] },
    pastClients: [],
    productionCompanies: [],
    advertisingAgencies: [],
    pastClients: [],
    awards: [{ delete: false }],
    presses: [{ delete: false }],
  });
  const [changedFields, setChangedFields] = useState({});
  const [removeIdArrays, setRemoveIdArrays] = useState({});

  const basicInformationFormikRef = useRef();
  const moreInformationFormikRef = useRef();

  function hashLinkScroll(sectionToRedirect) {
    if (sectionToRedirect !== null) {
      setHashedUrl(true);
      setTimeout(() => {
        setActivePanel([sectionToRedirect]);
        const element = document.getElementById(sectionToRedirect);
        if (element)
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        dispatch(checkSectionToRedirect(null));
      }, 0);
    } else {
      setActivePanel([]);
      setHashedUrl(false);
    }
  }

  useEffect(() => {
    hashLinkScroll(sectionToRedirect);
  }, []);

  useEffect(() => {
    if (!updateLoading && !updateError && updated && loader) {
      notify('success', 'Personal profile saved successfully');
      dispatch(syncAuthUserRequest());
      setLoader(false);
    }
    if (updateError) {
      notify('error', 'Failed to save user profile');
      dispatch(updateUserReset());
      setLoader(false);
    }
  }, [updateLoading, updateError, updated]);

  useEffect(() => {
    if (
      !expertiesUpdateLoading &&
      !expertiesUpdateError &&
      is_expertiesUpdated &&
      loader
    ) {
      notify('success', 'Personal profile saved successfully');
      dispatch(syncAuthUserRequest());
      setLoader(false);
    }

    if (expertiesUpdateError) {
      notify('error', 'Failed to save user profile');
      dispatch(updateUserReset());
      setLoader(false);
    }
  }, [expertiesUpdateLoading, expertiesUpdateError, is_expertiesUpdated]);

  useEffect(() => {
    dispatch(fetchUserDetailRequest(authUser.id));
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      let userCloned = _.cloneDeep(user);
      userCloned.birthday = formatDateString(userCloned.birthday, 'MM/DD/YYYY');
      setProfile(userCloned);
      userCloned.presses.forEach((press) => (press.delete = false));
      userCloned.awards.forEach((award) => (award.delete = false));
      setOtherUserInformation(userCloned);
      setProfileImage(user.profilePhotoS3Url);
      setOriginProfileImage(user.originProfilePhotoS3Url);
    }
  }, [user]);

  const handleProfileImage = (file) => {
    setProfileImage(file);
  };

  const countText = (text, maxLength) => {
    const count = text ? text.length : 0;
    return `${maxLength - count} Character(s) Left`;
  };

  const handleOriginProfileImage = (file) => {
    setOriginProfileImage(file);
  };

  const handleUpdateProfile = async (values) => {
    setUploadErrorMsg('');
    setLoader(true);
    let fieldsToUpdate = _.cloneDeep(values);
    try {
      if (profileImage instanceof File) {
        const profileS3DirName =
          process.env.REACT_APP_S3_BUCKET_PROFILE_DIRNAME;
        const s3File = await uploadFile(profileImage, profileS3DirName);
        if (s3File.location) {
          const profilePhotoS3Url = s3File.location;
          fieldsToUpdate.profilePhotoS3Url = profilePhotoS3Url;
        }
      } else {
        const profilePhotoS3Url = profileImage;
        fieldsToUpdate.profilePhotoS3Url = profilePhotoS3Url;
      }
      if (originProfileImage instanceof File) {
        const profileS3DirName =
          process.env.REACT_APP_S3_BUCKET_PROFILE_DIRNAME;
        const s3OriginFile = await uploadFile(
          originProfileImage,
          profileS3DirName
        );
        if (s3OriginFile.location) {
          const originProfilePhotoS3Url = s3OriginFile.location;
          fieldsToUpdate.originProfilePhotoS3Url = originProfilePhotoS3Url;
        }
      } else {
        const originProfilePhotoS3Url = originProfileImage;
        fieldsToUpdate.originProfilePhotoS3Url = originProfilePhotoS3Url;
      }
      const birthday = formatDateString(fieldsToUpdate.birthday, 'YYYY-MM-DD');
      dispatch(updateUserRequest(user.id, { ...fieldsToUpdate, birthday }));
    } catch (error) {
      dispatch(updateUserFail(error));
      setLoader(false);
      notify('error', 'Failed to save user profile');
      dispatch(updateUserReset());
    }
  };

  const handleUpdateExpertise = async (values) => {
    try {
      console.log('changedFields: ', changedFields);
      Object.keys(changedFields).forEach(( key ) => {
        removeIdArrays[key] && removeIdArrays[key].forEach(element => {
          values[key].push(element);
        });
      });
      const clonedValues = _.cloneDeep(values);
      mutateChangedUserDetail(
        changedFields,
        otherUserInformation,
        dispatch,
        clonedValues,
        setLoader
      );
      setChangedFields({});
      setRemoveIdArrays({});
    } catch (error) {
      dispatch(updateUserFail(error));
      setLoader(false);
    }
  };

  const updateChangedField = (field) => {
    setChangedFields({
      ...changedFields,
      ...field,
    });
  };

  const handleChangeHeadLine = (e, setFieldValue) => {
    const { value: headline } = e.target;
    setFieldValue('headline', headline);
    updateChangedField({
      headline: !_.isEqual(otherUserInformation.headline, headline),
    });
  };

  const handleChangeActiveSince = (e, setFieldValue, fieldName) => {
    const activeSince = e;
    setFieldValue(`${fieldName}`, activeSince);
    updateChangedField({
      activeSince: !_.includes(otherUserInformation.activeSince, activeSince),
    });
  };
  const handleChangeField = (data, fieldName, setFieldValue, key) => {
    setFieldValue(`${fieldName}`, data);
    updateChangedField({
      [key]: !_.isEqual(otherUserInformation[key], data),
    });
  };

  const handleChangeDirector = (data, fieldName, setFieldValue, key) => {
    setFieldValue(`${fieldName}`, data);
    updateChangedField({
      [key]: !_.isEqual(otherUserInformation[key].directors, data),
    });
  };

  const handleChangeSkills = (
    skillsList,
    skillsType,
    fieldName,
    setFieldValue
  ) => {
    setFieldValue(`skills.${skillsType}.${fieldName}`, skillsList);
    updateChangedField({
      skills: !_.isEqual(
        otherUserInformation.skills[skillsType][fieldName],
        skillsList
      ),
    });
  };

  const handleChangeAwards = (
    e,
    index,
    fieldName,
    handleChange,
    setFieldValue
  ) => {
    const awards = e.target ? e.target.value : e;
    if (handleChange) {
      handleChange(e);
    }
    if (setFieldValue) {
      setFieldValue(`awards[${index}].${fieldName}`, awards);
    }
    let flag = false;
    if (index + 1 > otherUserInformation.awards.length) {
      flag = true;
    } else {
      flag = !_.isEqual(
        otherUserInformation.awards[index][fieldName].toString(),
        awards
      );
    }
    setChangedFields({
      ...changedFields,
      awards: flag,
    });
  };

  const handleChangeEducation = (
    e,
    index,
    fieldName,
    handleChange,
    setFieldValue
  ) => {
    const educations = e.target ? e.target.value : e;
    if (handleChange) {
      handleChange(e);
    }
    if (setFieldValue) {
      setFieldValue(`educations[${index}].${fieldName}`, educations);
    }
    let flag = false;
    if (index + 1 > otherUserInformation.educations.length) {
      flag = true;
    } else {
      flag = !_.isEqual(
        otherUserInformation.educations[index][fieldName],
        educations
      );
    }
    updateChangedField({
      educations: flag,
    });
  };

  const handleChangePresses = (e, index, fieldName, handleChange) => {
    const presses = e.target ? e.target.value : e;
    if (handleChange) {
      handleChange(e);
    }
    let flag = false;
    if (index + 1 > otherUserInformation.presses.length) {
      flag = true;
    } else {
      flag = !_.isEqual(
        otherUserInformation.presses[index][fieldName].toString(),
        presses
      );
    }
    updateChangedField({
      presses: flag,
    });
  };
  const handleRemoveField = (values, id, key, arrayHelpers, index) => {
    if (!id) {
      return arrayHelpers.remove(index);
    }
    const clonedValues = _.cloneDeep(values);
    if (Array.isArray(clonedValues[key])) {
      clonedValues[key].forEach(element => {
        element.delete = (element.id === id);
        if (element.id === id) {
          if (removeIdArrays[key]) {
            removeIdArrays[key].push(element);
          } else {
            removeIdArrays[key] = [];
            removeIdArrays[key].push(element);
          }
          
        }
      });
      clonedValues[key] = removeIdArrays;
      setRemoveIdArrays(removeIdArrays);
      updateChangedField({
        [key]: true,
      });
    }
    arrayHelpers.remove(index);
  };

  return (
    <CardWrapper>
      <Card className='profileCard'>
        <ProfileLayout>
          <PersonaProfileWrapper>
            <Row className='profileImageInformationSection'>
              <Col>
                <h2 className='sectionHead'>Personal Profile</h2>
                <div className='profileImageSection'>
                  <ImageUploadNew
                    image={profileImage}
                    originImage={originProfileImage}
                    maxSize={maxFileUploadSize}
                    onChange={handleProfileImage}
                    onOriginChange={handleOriginProfileImage}
                    shape='rounded'
                  />
                  {uploadErrorMsg && (
                    <div className='helper-text lowercase'>
                      {uploadErrorMsg}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <Row className='section'>
              <Col>
                <h3 className='sectionHead'>Information</h3>
                <div className='informationForm'>
                  <Formik
                    enableReinitialize
                    innerRef={basicInformationFormikRef}
                    initialValues={profile}
                    validationSchema={schema}
                    onSubmit={handleUpdateProfile}
                  >
                    {({
                      values,
                      touched,
                      errors,
                      setFieldValue,
                      handleChange,
                      resetForm,
                    }) => (
                      <Form id='contact-information'>
                        <Row gutter={gutter30} justify='start'>
                          <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Full name</label>
                            <Field
                              component={InputField}
                              name='fullName'
                              type='text'
                            />
                          </Col>
                          <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Nickname</label>
                            <Field
                              component={InputField}
                              name='nickname'
                              type='text'
                            />
                          </Col>

                          <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>
                              Primary Gig Role
                            </label>
                            <Field
                              component={InputField}
                              name='jobTitle'
                              type='text'
                            />
                          </Col>
                          <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Email</label>
                            <Field
                              component={InputField}
                              name='email'
                              type='text'
                              onChange={handleChange}
                            />
                          </Col>

                          <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Date of Birth</label>
                            <DateInput
                              name='birthday'
                              inputValue={values.birthday}
                              value={values.birthday}
                              onChangeDateInput={(date) =>
                                setFieldValue('birthday', date)
                              }
                            />
                            {touched.birthday && errors.birthday && (
                              <ErrorMessageDiv className='helper-text lowercase'>
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className='fas fa-times cross-icon'
                                />
                                {errors.birthday}
                              </ErrorMessageDiv>
                            )}
                          </Col>
                          <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Phone</label>
                            <Field name='phone'>
                              {() => (
                                <NumberFormat
                                  customInput={Input}
                                  format='+1 (###) ###-####'
                                  mask='_'
                                  value={values.phone}
                                  onValueChange={(phone) =>
                                    setFieldValue('phone', phone.value)
                                  }
                                />
                              )}
                            </Field>
                            {touched.phone && errors.phone && (
                              <ErrorMessageDiv className='helper-text lowercase'>
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className='fas fa-times cross-icon'
                                />
                                {errors.phone}
                              </ErrorMessageDiv>
                            )}
                          </Col>

                          {/* <Col md={8} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>
                              Union Number - <i>Optional</i>
                            </label>
                            <Field
                              component={InputField}
                              name='union'
                              type='text'
                            />
                          </Col> */}
                          <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>
                              Links to your work - <i>Optional</i>
                            </label>
                            <Field
                              component={InputField}
                              name='linkToWork'
                              type='text'
                            />
                          </Col>
                          <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>
                              Website - <i>Optional</i>
                            </label>
                            <Field
                              component={InputField}
                              name='website'
                              type='text'
                            />
                          </Col>
                        </Row>
                        <Row className='actionRow'>
                          <Col span={24}>
                            <div className='submit-btn-wrapper'>
                              <Button
                                htmlType='submit'
                                shape='round'
                                type='primary'
                                loading={loader}
                              >
                                Save
                              </Button>
                              {/* <Button shape='round' onClick={resetForm}>
                                Cancel
                              </Button> */}
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Col>
            </Row>
            <hr className="pp-hr"></hr>
              <Formik
                enableReinitialize
                innerRef={moreInformationFormikRef}
                initialValues={otherUserInformation}
                validationSchema={schema}
                onSubmit={handleUpdateExpertise}
              >
                {({
                  values,
                  touched,
                  errors,
                  setFieldValue,
                  handleChange,
                  resetForm,
                }) => (
                  <FormWrapper>
                    <Form className="p-profile-collapse">
                      {(activePanel.length || !hashedUrl) && (
                        <Collapse accordion className="new-accordian-sec" expandIconPosition="right">
                          <Panel header="About" key="1">
                            <label className="fieldLabel">Summary</label>
                            <Row gutter={gutter30}>
                              <Col span={24}>
                                <Field>
                                  {() => (
                                    <>
                                      <TextArea
                                        rows={3}
                                        className="disableResize"
                                        value={values.headline}
                                        onChange={(e) => {
                                          handleChangeHeadLine(e, setFieldValue);
                                        }}
                                      />
                                    </>
                                  )}
                                </Field>
                                {touched.headline && errors.headline && (
                                  <div className="helper-text">
                                    {errors.headline}
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Panel>
                          <Panel header="Active Since" key="2">
                            <label className="fieldLabel">First Paid Gig:</label>
                            <Row gutter={gutter30}>
                              <Col span={6} className="width-limit">
                                <Field>
                                  {() => (
                                    <Select
                                      style={{ width: "100%" }}
                                      placeholder="Year"
                                      value={values.activeSince?.year}
                                      onChange={(e) => {
                                        handleChangeActiveSince(
                                          e,
                                          setFieldValue,
                                          "activeSince.year"
                                        );
                                      }}
                                    >
                                      {YEARS().map((year) => (
                                        <Option value={year} key={`year-${year}`}>
                                          {year}
                                        </Option>
                                      ))}
                                    </Select>
                                  )}
                                </Field>
                                {touched.year && errors.year && (
                                  <div className="helper-text">{errors.year}</div>
                                )}
                              </Col>
                              <Col span={6} className="width-limit">
                                <Field>
                                  {() => (
                                    <Select
                                      style={{ width: "100%" }}
                                      placeholder="Month"
                                      value={values.activeSince?.month}
                                      onChange={(e) => {
                                        handleChangeActiveSince(
                                          e,
                                          setFieldValue,
                                          "activeSince.month"
                                        );
                                      }}
                                    >
                                      {MONTHS.map((month, index) => (
                                        <Option
                                          value={index + 1}
                                          key={`month-${index + 1}`}
                                        >
                                          {month}
                                        </Option>
                                      ))}
                                    </Select>
                                  )}
                                </Field>
                                {touched.month && errors.month && (
                                  <div className="helper-text">
                                    {errors.month}
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Panel>
                          <Panel header="Education" key="3">
                            <FieldArray name="educations">
                              {(arrayHelpers) => (
                                <>
                                  {values.educations?.map((education, index) => (
                                    <span key={index}>
                                      <Row
                                        gutter={gutter30}
                                        className="education-section"
                                      >
                                        <Col span={12} className="width-limit">
                                          <label className="fieldLabel">
                                            School/University
                                          </label>
                                          <Field
                                            name={`educations[${index}].university`}
                                            type="text"
                                            component={InputField}
                                            onChange={(e) => {
                                              const fieldName = "university";
                                              handleChangeEducation(
                                                e,
                                                index,
                                                fieldName,
                                                handleChange,
                                                null
                                              );
                                            }}
                                          ></Field>
                                        </Col>
                                        <Col span={12} className="width-limit">
                                          <label className="fieldLabel">
                                            Degree
                                          </label>
                                          <Field
                                            name={`educations[${index}].degree`}
                                            type="text"
                                            component={InputField}
                                            onChange={(e) => {
                                              const fieldName = "degree";
                                              handleChangeEducation(
                                                e,
                                                index,
                                                fieldName,
                                                handleChange,
                                                null
                                              );
                                            }}
                                          ></Field>
                                        </Col>
                                      </Row>
                                      <Row gutter={gutter30}>
                                        <Col span={12} className="width-limit">
                                          <label className="fieldLabel">
                                            Field of study
                                          </label>
                                          <Field
                                            name={`educations[${index}].studyField`}
                                            type="text"
                                            component={InputField}
                                            onChange={(e) => {
                                              const fieldName = "studyField";
                                              handleChangeEducation(
                                                e,
                                                index,
                                                fieldName,
                                                handleChange,
                                                null
                                              );
                                            }}
                                          ></Field>
                                        </Col>

                                        <Col span={6} className="width-limit">
                                          <label className="fieldLabel">
                                            Start Year
                                          </label>
                                          <Select
                                            style={{ width: "100%" }}
                                            name={`educations[${index}].startYear`}
                                            value={education.startYear}
                                            placeholder="Year"
                                            onChange={(e) => {
                                              const fieldName = "startYear";
                                              handleChangeEducation(
                                                e,
                                                index,
                                                fieldName,
                                                null,
                                                setFieldValue
                                              );
                                            }}
                                          >
                                            {YEARS().map((year) => (
                                              <Option
                                                value={year}
                                                key={`start-${year}`}
                                              >
                                                {year}
                                              </Option>
                                            ))}
                                          </Select>
                                          {touched.startYear &&
                                            errors.startYear && (
                                              <div className="helper-text">
                                                {errors.startYear}
                                              </div>
                                            )}
                                        </Col>
                                        <Col span={6} className="width-limit">
                                          <label className="fieldLabel">
                                            End Year (or expected)
                                          </label>
                                          <Select
                                            style={{ width: "100%" }}
                                            value={education.endYear}
                                            placeholder="Year"
                                            onChange={(e) => {
                                              const fieldName = "endYear";
                                              handleChangeEducation(
                                                e,
                                                index,
                                                fieldName,
                                                null,
                                                setFieldValue
                                              );
                                            }}
                                          >
                                            {YEARS().map((year) => (
                                              <Option
                                                value={year}
                                                key={`end-${year}`}
                                              >
                                                {year}
                                              </Option>
                                            ))}
                                          </Select>
                                          {touched.endYear && errors.endYear && (
                                            <div className="helper-text">
                                              {errors.endYear}
                                            </div>
                                          )}
                                        </Col>
                                        <RemoveButton className="remove-btn">
                                          <Button
                                            type="link"
                                            onClick={() => {
                                              handleRemoveField(
                                                values,
                                                education.id,
                                                "educations",
                                                arrayHelpers,
                                                index
                                              );
                                            }}
                                          >
                                            <CloseCircleFilled className="closeCircle" />{" "}
                                            <span>Remove</span>
                                          </Button>
                                        </RemoveButton>
                                      </Row>
                                    </span>
                                  ))}
                                  <div className="add-more edu-add-more">
                                    <Button
                                      type="link"
                                      className="addBtn"
                                      onClick={() =>
                                        arrayHelpers.push({
                                          university: "",
                                          degree: "",
                                          studyField: "",
                                          startYear: null,
                                          endYear: null,
                                        })
                                      }
                                    >
                                      <PlusCircleOutlined /> Add Education
                                    </Button>
                                  </div>
                                </>
                              )}
                            </FieldArray>
                          </Panel>
                          <Panel header="Skills" key="4">
                            <Row gutter={gutter30}>
                              <Col span={12} className="width-limit">
                                <label className="fieldLabel">
                                  Primary Skills
                                </label>
                                <Field>
                                  {() => (
                                    <>
                                      <ProfileTagAutocomplete
                                        tags={tagFormattedSkills(
                                          values.skills?.primarySkills
                                            ?.primarySkill
                                        )}
                                        placeholder="Enter your primary skills"
                                        maxLength={3}
                                        onChange={(skills) => {
                                          const names = skills.map(
                                            (skill) => skill.name
                                          );
                                          const fieldName = "primarySkill";
                                          const skillsType = "primarySkills";
                                          handleChangeSkills(
                                            names,
                                            skillsType,
                                            fieldName,
                                            setFieldValue
                                          );
                                        }}
                                      />
                                      <div className="muted align-right">
                                        Maximum 3 skills
                                      </div>
                                    </>
                                  )}
                                </Field>
                                {touched.primary && errors.primary && (
                                  <div className="helper-text">
                                    {errors.primary}
                                  </div>
                                )}
                              </Col>
                              <Col span={12} className="width-limit">
                                <label className="fieldLabel">
                                  Secondary Skills
                                </label>
                                <Field>
                                  {() => (
                                    <>
                                      <ProfileTagAutocomplete
                                        tags={tagFormattedSkills(
                                          values.skills?.secondarySkills
                                            ?.secondarySkill
                                        )}
                                        placeholder="Enter your secondary skills"
                                        maxLength={15}
                                        onChange={(skills) => {
                                          const names = skills.map(
                                            (skill) => skill.name
                                          );
                                          const fieldName = "secondarySkill";
                                          const skillsType = "secondarySkills";
                                          handleChangeSkills(
                                            names,
                                            skillsType,
                                            fieldName,
                                            setFieldValue
                                          );
                                        }}
                                      />
                                      <div className="muted align-right">
                                        Maximum 15 skills
                                      </div>
                                    </>
                                  )}
                                </Field>
                                {touched.secondary && errors.secondary && (
                                  <div className="helper-text">
                                    {errors.secondary}
                                  </div>
                                )}
                              </Col>
                            </Row>
                            <Row gutter={gutter30}>
                              <Col span={12} className="width-limit">
                                <label className="fieldLabel">
                                  Tools & Technologies
                                </label>
                                <Field>
                                  {() => (
                                    <>
                                      <ProfileTagAutocomplete
                                        tags={tagFormattedSkills(
                                          values.skills?.toolsAndTechnologies
                                            ?.toolAndTechnology
                                        )}
                                        placeholder="Enter Tool & Technologies you worked with"
                                        maxLength={15}
                                        onChange={(skills) => {
                                          const names = skills.map(
                                            (skill) => skill.name
                                          );
                                          const fieldName = "toolAndTechnology";
                                          const skillsType =
                                            "toolsAndTechnologies";
                                          handleChangeSkills(
                                            names,
                                            skillsType,
                                            fieldName,
                                            setFieldValue
                                          );
                                        }}
                                      />
                                      <div className="muted align-right">
                                        Maximum 15 skills
                                      </div>
                                    </>
                                  )}
                                </Field>
                                {touched.toolsAndTechnologies &&
                                  errors.toolsAndTechnologies && (
                                    <div className="helper-text">
                                      {errors.toolsAndTechnologies}
                                    </div>
                                  )}
                              </Col>
                              <Col span={12} className="width-limit">
                                <div className="infoText infoMarginTop">
                                  <InfoCircleFilled className="infoCircle" />
                                  <p>Separate with a comma</p>
                                </div>
                              </Col>
                            </Row>
                          </Panel>
                          
                          <Panel
                            header="Directors & Talents You Worked With"
                            key="5"
                          >
                            <Row gutter={gutter30}>
                              <Col span={12} className='width-limit'>
                                <label className='fieldLabel'>
                                  Directors
                                </label>
                                <Field>
                                  {() => (
                                    <ProfileTagAutocomplete
                                      tags={tagFormattedDirectors(
                                        values.directors?.directors
                                      )}
                                      placeholder='Enter Directors you have worked with in the past'
                                      onChange={(directors) => {
                                        const names = directors.map(
                                          (director) => director.name
                                        );
                                        const fieldName =
                                          'directors.directors';
                                        handleChangeDirector(
                                          names,
                                          fieldName,
                                          setFieldValue,
                                          'directors'
                                        );
                                      }}
                                    />
                                  )}
                                </Field>
                              </Col>
                              <Col span={12} className='width-limit'>
                                <label className='fieldLabel'>
                                  Talents
                                </label>
                                <Field>
                                  {() => (
                                    <ProfileTagAutocomplete
                                      tags={tagFormattedProducers(
                                        values.producers?.producers
                                          ?.producer
                                      )}
                                      placeholder='Enter Talents you have worked with in the past'
                                      onChange={(producers) => {
                                        const names = producers.map(
                                          (producer) => producer.name
                                        );
                                        const fieldName =
                                          'producers.producers.producer';
                                        handleChangeField(
                                          names,
                                          fieldName,
                                          setFieldValue,
                                          'producers'
                                        );
                                      }}
                                    />
                                  )}
                                </Field>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={24}>
                                <div className='infoText infoMarginTop'>
                                  <InfoCircleFilled className='infoCircle' />
                                  <p>Separate with a comma</p>
                                </div>
                              </Col>
                            </Row>
                          </Panel>
                          <Panel
                            header="Production Bands, Advertising Agencies & Past Clients"
                            key="6"
                          >
                            <Row gutter={gutter30}>
                              <Col span={12} className="width-limit">
                                <label className="fieldLabel">
                                  Production Bands
                                </label>
                                <Field>
                                  {() => (
                                    <ProfileTagAutocomplete
                                      tags={tagFormattedCompanies(
                                        values.productionCompanies
                                      )}
                                      placeholder="Add Production Bands you have worked for in the past"
                                      onChange={(companies) => {
                                        const names = companies.map(
                                          (company) => company.name
                                        );
                                        const fieldName = "productionCompanies";
                                        handleChangeField(
                                          names,
                                          fieldName,
                                          setFieldValue,
                                          "productionCompanies"
                                        );
                                      }}
                                    />
                                  )}
                                </Field>
                              </Col>

                              <Col span={12} className="width-limit">
                                <label className="fieldLabel">
                                  Advertising Agencies
                                </label>
                                <Field>
                                  {() => (
                                    <ProfileTagAutocomplete
                                      tags={tagFormattedAgencies(
                                        values.advertisingAgencies
                                      )}
                                      placeholder="Add Advertising Agencies you have worked for in the past"
                                      onChange={(agencies) => {
                                        const names = agencies.map(
                                          (agency) => agency.name
                                        );
                                        const fieldName = "advertisingAgencies";
                                        handleChangeField(
                                          names,
                                          fieldName,
                                          setFieldValue,
                                          "advertisingAgencies"
                                        );
                                      }}
                                    />
                                  )}
                                </Field>
                              </Col>
                            </Row>
                            <Row gutter={gutter30}>
                              <Col span={12} className="width-limit">
                                <label className="fieldLabel">Past Clients</label>
                                <Field>
                                  {() => (
                                    <ProfileTagAutocomplete
                                      tags={tagFormattedClients(
                                        values.pastClients
                                      )}
                                      placeholder="Add the Clients you have worked for in the past"
                                      onChange={(clients) => {
                                        const names = clients.map(
                                          (client) => client.name
                                        );
                                        const fieldName = "pastClients";
                                        handleChangeField(
                                          names,
                                          fieldName,
                                          setFieldValue,
                                          "pastClients"
                                        );
                                      }}
                                    />
                                  )}
                                </Field>
                              </Col>
                              <Col span={12} className="width-limit">
                                <div className="infoText infoMarginTop">
                                  <InfoCircleFilled className="infoCircle" />
                                  <p>Separate with a comma</p>
                                </div>
                              </Col>
                            </Row>
                          </Panel>
                          <Panel header="Awards" key="7">
                            <FieldArray name="awards">
                              {(arrayHelpers) => (
                                <>
                                  {values.awards?.map((award, index) => (
                                    <Row gutter={gutter30} key={index}>
                                      <Col span={12} className="width-limit">
                                        <label className="fieldLabel">
                                          Award Title
                                        </label>
                                        <Field
                                          name={`awards[${index}].title`}
                                          type="text"
                                          component={InputField}
                                          onChange={(e) => {
                                            const fieldName = "title";
                                            handleChangeAwards(
                                              e,
                                              index,
                                              fieldName,
                                              handleChange,
                                              null
                                            );
                                          }}
                                        />
                                      </Col>
                                      <Col
                                        span={6}
                                        className="width-selected-limit"
                                      >
                                        <label className="fieldLabel">Year</label>
                                        <Select
                                          style={{ width: "100%" }}
                                          value={award?.year?.toString()}
                                          onChange={(e) => {
                                            const fieldName = "year";
                                            handleChangeAwards(
                                              e,
                                              index,
                                              fieldName,
                                              null,
                                              setFieldValue
                                            );
                                          }}
                                          placeholder="Year"
                                        >
                                          {YEARS().map((year) => (
                                            <Option
                                              value={year.toString()}
                                              key={`year-${year}`}
                                            >
                                              {year}
                                            </Option>
                                          ))}
                                        </Select>
                                      </Col>
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          handleRemoveField(
                                            values,
                                            award.id,
                                            "awards",
                                            arrayHelpers,
                                            index
                                          );
                                        }}
                                      >
                                        <CloseCircleFilled className="closeCircle" />
                                      </Button>
                                    </Row>
                                  ))}
                                  <div className="add-more">
                                    <Button
                                      type="link"
                                      className="addBtn"
                                      onClick={() =>
                                        arrayHelpers.push({
                                          title: "",
                                          year: null,
                                        })
                                      }
                                    >
                                      <PlusCircleOutlined /> Add Award
                                    </Button>
                                  </div>
                                </>
                              )}
                            </FieldArray>
                          </Panel>
                          <Panel header="Press" key="8">
                            <FieldArray name="presses">
                              {(arrayHelpers) => (
                                <>
                                  {values.presses?.map((press, index) => (
                                    <Row gutter={gutter30} key={index}>
                                      <Col span={10} className="width-limit">
                                        <label className="fieldLabel">
                                          Title
                                        </label>
                                        <Field
                                          name={`presses[${index}].description`}
                                          type="text"
                                          component={InputField}
                                          onChange={(e) => {
                                            const fieldName = "description";
                                            handleChangePresses(
                                              e,
                                              index,
                                              fieldName,
                                              handleChange
                                            );
                                          }}
                                        />
                                      </Col>

                                      <Col
                                        span={10}
                                        className="width-limit wl-responsive"
                                      >
                                        <label className="fieldLabel">Link</label>
                                        <Field
                                          name={`presses[${index}].url`}
                                          type="text"
                                          component={InputField}
                                          onChange={(e) => {
                                            const fieldName = "url";
                                            handleChangePresses(
                                              e,
                                              index,
                                              fieldName,
                                              handleChange
                                            );
                                          }}
                                        />
                                      </Col>
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          handleRemoveField(
                                            values,
                                            press.id,
                                            "presses",
                                            arrayHelpers,
                                            index
                                          );
                                        }}
                                      >
                                        <CloseCircleFilled className="closeCircle" />
                                      </Button>
                                    </Row>
                                  ))}
                                  <div className="add-more">
                                    <Button
                                      type="link"
                                      className="addBtn"
                                      onClick={() => arrayHelpers.push("")}
                                    >
                                      <PlusCircleOutlined />
                                      Add Link
                                    </Button>
                                  </div>
                                </>
                              )}
                            </FieldArray>
                          </Panel>
                        </Collapse>
                      )}
                      <Row className="moreInfoActionRow">
                        <Col>
                          <Button
                            htmlType='submit'
                            shape='round'
                            type='primary'
                            loading={loader}
                          >
                            Save
                          </Button>
                          <Button shape='round' onClick={resetForm}>
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </FormWrapper>
                )}
              </Formik>
          </PersonaProfileWrapper>
        </ProfileLayout>
      </Card>
    </CardWrapper>
  );
};
