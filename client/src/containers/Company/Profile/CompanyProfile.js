import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Divider } from 'antd';
import { Formik, Field, Form, FieldArray } from 'formik';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import schema from './schema';
import Collapse from "@iso/components/uielements/collapse";
import { maxFileUploadSize } from '@iso/config/env';
import { uploadFile } from '@iso/lib/helpers/s3';
import notify from '@iso/lib/helpers/notify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import LocationField from '@iso/components/LocationField';
import ZipCode from '@iso/components/shared/ZipCode';
import Button from '@iso/components/uielements/button';
import { InputField } from '@iso/components';
import Input from '@iso/components/uielements/input';
import ImageUploadNew from '@iso/components/ImageUploadNew/ImageUploadNew';
import Select, { SelectOption } from '@iso/components/uielements/select';
import ProfileLayout from '@iso/containers/Profile';
import {
  fetchCompanyDetailRequest,
  fetchCompanyTypeRequest,
  fetchBusinessTypeRequest,
  updateCompanyRequest,
  updateCompanyFail,
} from '@iso/redux/company/actions';
import {
  CloseCircleFilled,
  InfoCircleFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { syncAuthUserRequest } from '@iso/redux/auth/actions';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import basicStyle from '@iso/assets/styles/constants';
import EmptyCompanyLogo from '@iso/assets/images/avatar-2.svg';
import TextArea from "antd/lib/input/TextArea";
import ProfileTagAutocomplete from "@iso/containers/Profile/ProfileTagAutocomplete/ProfileTagAutocomplete";

// DON'T REMOVE As the business member is disabled for now.
// import BusinessMemberTable from './BusinessMembers';
import CompanyProfileWrapper, {
  CardWrapper,
  ErrorMessageDiv,
  FormWrapper,
} from './CompanyProfile.style';

const Option = SelectOption;

export default () => {
  // DON'T REMOVE As the business member is disabled for now.
  // const memberList = [
  //   {
  //     role: 'Owner/Admin',
  //     name: 'Paul Amorese',
  //     handle: 'paulamorese',
  //     status: 'Linked',
  //   },
  //   {
  //     role: 'Admin',
  //     name: '',
  //     handle: '',
  //     status: 'Optional',
  //   },
  // ];

  const dispatch = useDispatch();
  const { error: updateError, loading: updateLoading } = useSelector(
    (state) => state.Company.update
  );
  const { companyId } = useSelector((state) => state.AccountBoard);
  const { company: companyDetail } = useSelector((state) => state.Company);
  const { locations } = useSelector((state) => state.Location);
  const { companyTypeList, businessTypeList } = useSelector(
    (state) => state.Company
  );
  const { gutter30 } = basicStyle;
  const [profileImage, setProfileImage] = useState(null);
  const [activePanel, setActivePanel] = useState([]);
  const [originProfileImage, setOriginProfileImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isImageUploadFailed, setIsImageUploadFailed] = useState(false);
  const [changedFields, setChangedFields] = useState({});
  const [profile, setProfile] = useState({
    id: companyId,
    type: "",
    title: "",
    owner_email: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zipCode: "",
    address: "",
    vimeo: "",
    ein: "",
    profilePhotoS3Url: "",
    originProfilePhotoS3Url: "",
    businessType: "",
    summary: "",
    website: "",
    headquarters: "",
    industry: "",
    yearFounded: "",
    companySize: "",
    pastClients: [],
    awards: [],
    presses: [],
    specialities: [],
  });

    const [removeIdArrays, setRemoveIdArrays] = useState({});

    const [hashedUrl, setHashedUrl] = useState(false);
    const [awardToUpdate, setAwardToUpdate] = useState([]);
    const [pressToUpdate, setPressToUpdate] = useState([]);

  const basicInformationFormikRef = useRef();

  const { Panel } = Collapse;

  useEffect(() => {
    if (!updateLoading && !updateError && loader) {
      notify('success', 'Band profile saved successfully');
      dispatch(syncAuthUserRequest());
    }

    if (!updateLoading && loader) {
      setLoader(false);
    }
    if (updateError) {
      notify('error', 'Failed to save band profile');
    }
  }, [updateLoading, updateError]);

  useEffect(() => {
    dispatch(fetchCompanyDetailRequest(companyId));
    dispatch(fetchLocationsRequest());
    dispatch(fetchCompanyTypeRequest());
    dispatch(fetchBusinessTypeRequest());
  }, [dispatch]);

  useEffect(() => {
    if (companyDetail) {
      setProfile(companyDetail);
      setProfileImage(companyDetail.profilePhotoS3Url);
      setOriginProfileImage(companyDetail.originProfilePhotoS3Url);
    }
  }, [companyDetail]);

  const handleProfileImage = (file) => {
    setProfileImage(file);
  };

  const handleOriginProfileImage = (file) => {
    setOriginProfileImage(file);
  };

  const tagFormattedDirectors = (directors) => {
    if (!directors) return [];
    return directors.map((director) => ({ id: director, name: director }));
  };

  const updateChangedField = (field) => {
    setChangedFields({
      ...changedFields,
      ...field,
    });
  };

  const handleChangeMultiSelect = (data, fieldName, setFieldValue, key) => {
    setFieldValue(`${fieldName}`, data);
  };

  const handleRemoveField = (values, id, key, arrayHelpers, index) => {
    if (!id) {
      return arrayHelpers.remove(index);
    }
    const clonedValues = _.cloneDeep(values);
    if (Array.isArray(clonedValues[key])) {
      clonedValues[key].forEach((element) => {
        element.delete = element.id === id;
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

  const YEARS = () => {
    const currentYear = new Date().getFullYear();
    return _.range(currentYear, 1990, -1);
  };

  const handleChangeField = (
    e,
    index,
    fieldName,
    handleChange,
    setFieldValue,
    key
  ) => {
    const awards = e.target ? e.target.value : e;
    if (handleChange) {
      handleChange(e);
    }
    if (setFieldValue) {
      setFieldValue(`awards[${index}].${fieldName}`, awards);
      setFieldValue(`awards[${index}].delete`, false);
    }
    let flag = false;
    if (key === "award") {
      if (index + 1 > profile.awards.length) {
        flag = true;
      } else {
        flag = !_.isEqual(profile.awards[index][fieldName], awards);
      }
    }
    if (key === "presses") {
      if (index + 1 > profile.awards.length) {
        flag = true;
      } else {
        flag = !_.isEqual(profile.awards[index][fieldName], awards);
      }
    }
    setChangedFields({
      ...changedFields,
      [key]: flag,
    });
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoader(true);
      setIsImageUploadFailed('');
      Object.keys(changedFields).forEach((key) => {
        removeIdArrays[key] &&
          removeIdArrays[key].forEach((element) => {
            values[key].push(element);
          });
      });
      let fieldsToUpdate = _.cloneDeep(values);
      fieldsToUpdate.year_founded = values.yearFounded;
      fieldsToUpdate.awards = values.awards.map((x) => {
        if (x.awardYear && x.awardTitle && x.awardTitle.length > 0)
          return {
            id: x.id,
            award_year: x.awardYear,
            award_title: x.awardTitle,
            delete: x.delete || false,
          };
      }).filter(Boolean);
      fieldsToUpdate.zip_code = values.zipCode;

      // This is a temporary fix just to verify Payload data from Frontend to API
      // fieldsToUpdate.awards.shift();

      fieldsToUpdate.awards = [...fieldsToUpdate.awards];
      fieldsToUpdate.presses = values.presses.map((x) => {
        return {
          id: x.id,
          description: x.description,
          url: x.url,
          delete: x.delete || false,
        };
      });
      
      fieldsToUpdate.presses = [...fieldsToUpdate.presses];
      fieldsToUpdate.past_clients = values.pastClients;
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
          fieldsToUpdate['originProfilePhotoS3Url'] = s3OriginFile.location;
        }
      } else {
        fieldsToUpdate['originProfilePhotoS3Url'] = originProfileImage;
      }
      dispatch(updateCompanyRequest(profile.id, { ...fieldsToUpdate }));
      setChangedFields({});
      setRemoveIdArrays({});
    } catch (error) {
      dispatch(updateCompanyFail(error));
      setLoader(false);
      setIsImageUploadFailed('Image upload failed');
    }
  };
  return (
    <CardWrapper>
      <Card className='profileCard'>
        <ProfileLayout>
          <CompanyProfileWrapper>
            <Row className='profileImageInformationSection'>
              <Col>
                <h2 className='sectionHead'>Band Profile </h2>
                <div className='profileImageSection'>
                  <ImageUploadNew
                    image={profileImage}
                    originImage={originProfileImage}
                    maxSize={maxFileUploadSize}
                    helperImage={EmptyCompanyLogo}
                    onChange={handleProfileImage}
                    onOriginChange={handleOriginProfileImage}
                  />
                  {isImageUploadFailed && (
                    <div className='helper-text lowercase'>
                      Uploading Image Failed
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <Row className='section'>
              <Col span={24}>
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
                      <FormWrapper>
                      <Form>
                        <Row gutter={gutter30} justify='start'>
                          <Col md={24} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Business Type</label>
                            <Field>
                              {() => (
                                <Select
                                  showSearch
                                  disabled={!companyDetail?.isOwner}
                                  name='businessType'
                                  style={{ width: '100%' }}
                                  value={values.businessType}
                                  onChange={(value) => {
                                    setFieldValue('businessType', value);
                                  }}
                                >
                                  {businessTypeList.map((bt) => (
                                    <Option
                                      value={bt.businessTypeValue}
                                      key={bt.businessTypeValue}
                                    >
                                      {bt.businessTypeName}
                                    </Option>
                                  ))}
                                </Select>
                              )}
                            </Field>
                          </Col>

                          {/* <Col md={12} sm={12} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Category</label>
                            <Field>
                              {() => (
                                <Select
                                  showSearch
                                  name='type'
                                  disabled={!companyDetail?.isOwner}
                                  style={{ width: '100%' }}
                                  value={values.type}
                                  onChange={(value) => {
                                    setFieldValue('type', value);
                                  }}
                                >
                                  {companyTypeList.map((ct) => (
                                    <Option
                                      value={ct.companyTypeValue}
                                      key={ct.companyTypeValue}
                                    >
                                      {ct.companyTypeName}
                                    </Option>
                                  ))}
                                </Select>
                              )}
                            </Field>
                          </Col> */}
                        </Row>
                        <Row gutter={gutter30} justify='start'>
                          <Col md={24} className='width-limit'>
                            <label className='fieldLabel'>
                              Legal Band Name
                            </label>
                            <Field
                              component={InputField}
                              name='title'
                              type='text'
                            />
                          </Col>
                        </Row>
                        <Row gutter={gutter30} justify='start'>
                          <Col md={24} className='width-limit'>
                            <label className='fieldLabel'>
                              Business Address
                            </label>
                            <Field
                              component={InputField}
                              name='address'
                              type='text'
                            />
                          </Col>
                        </Row>
                        <Row gutter={gutter30} justify='start'>
                          <Col md={8} sm={8} xs={24} className='width-limit'>
                            <label className='fieldLabel'>City</label>
                            <Field name='city'>
                              {() => (
                                <LocationField
                                  value={values.city}
                                  locations={locations.city}
                                  onChange={(city) =>
                                    setFieldValue('city', city)
                                  }
                                />
                              )}
                            </Field>
                            {touched.city && errors.city && (
                              <ErrorMessageDiv className='helper-text lowercase'>
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className='fas fa-times cross-icon'
                                />
                                {errors.city}
                              </ErrorMessageDiv>
                            )}
                          </Col>
                          <Col md={8} sm={8} xs={24} className='width-limit'>
                            <label className='fieldLabel'>State</label>
                            <Field name='state'>
                              {() => (
                                <LocationField
                                  value={values.state}
                                  locations={locations.state}
                                  onChange={(state) =>
                                    setFieldValue('state', state)
                                  }
                                />
                              )}
                            </Field>
                            {touched.state && errors.state && (
                              <ErrorMessageDiv className='helper-text lowercase'>
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className='fas fa-times cross-icon'
                                />
                                {errors.state}
                              </ErrorMessageDiv>
                            )}
                          </Col>
                          <Col md={8} sm={8} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Zip</label>
                            <Field name='zipCode'>
                              {() => (
                                <ZipCode
                                  value={values.zipCode}
                                  onChange={(zipCode) =>
                                    setFieldValue('zipCode', zipCode)
                                  }
                                />
                              )}
                            </Field>
                            {touched.zipCode && errors.zipCode && (
                              <ErrorMessageDiv className='helper-text lowercase'>
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className='fas fa-times cross-icon'
                                />
                                {errors.zipCode}
                              </ErrorMessageDiv>
                            )}
                          </Col>
                        </Row>
                        <Row
                          gutter={gutter30}
                          justify='start'
                          className='width-limit'
                        >
                          <Col md={8} sm={8} xs={24} className='width-limit'>
                            <label className='fieldLabel'>
                              Phone - <i>Optional</i>
                            </label>
                            <NumberFormat
                              format='+1 (###) ###-####'
                              mask='_'
                              customInput={Input}
                              value={values.phone}
                              onValueChange={(phone) =>
                                setFieldValue('phone', phone.value)
                              }
                              name='phone'
                            />
                          </Col>
                          <Col md={8} sm={8} xs={24} className='width-limit'>
                            <label className='fieldLabel'>
                              EIN - <i>Optional</i>
                            </label>
                            <Field
                              disabled={!companyDetail?.isOwner}
                              component={InputField}
                              name='ein'
                              type='text'
                            />
                          </Col>
                          <Col md={8} sm={8} xs={24} className='width-limit'>
                            <label className='fieldLabel'>Email</label>
                            <Field
                              component={InputField}
                              name='ownerEmail'
                              type='text'
                            />
                          </Col>
                        </Row>
                        <Collapse
                            bordered={false}
                            defaultActiveKey={activePanel}
                            expandIconPosition="right"
                          >
                            <>
                              <Panel
                                header={"About"}
                                key="section-about"
                                id="section-about"
                              >
                                <label className="fieldLabel">Summary</label>
                                <Row gutter={gutter30} className="headline">
                                  <Col span={24}>
                                    <Field>
                                      {() => (
                                        <>

                                          <TextArea
                                            rows={3}
                                            className="disableResize"
                                            // maxLength={140}
                                            value={values.summary}
                                            onChange={(headline) =>
                                              setFieldValue(
                                                "summary",
                                                headline.target.value
                                              )
                                            }
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
                              <Panel
                                header={"Overview"}
                                key="section-overview"
                                id="section-overview"
                              >
                                <FieldArray name="overview">
                                  <>
                                    <span>
                                      <Row
                                        gutter={gutter30}
                                        className="education-section"
                                      >
                                        <Col span={12} className="width-limit">
                                          <label className="fieldLabel">
                                            Website
                                          </label>
                                          <Field
                                            name={`website`}
                                            type="text"
                                            component={InputField}
                                          ></Field>
                                        </Col>
                                        <Col span={12} className="width-limit">
                                          <label className="fieldLabel">
                                            Headquarters
                                          </label>
                                          <Field
                                            name={`headquarters`}
                                            type="text"
                                            component={InputField}
                                          ></Field>
                                        </Col>
                                      </Row>
                                      <Row gutter={gutter30}>
                                        <Col
                                          span={12}
                                          className="width-limit-overview"
                                        >
                                          <label className="fieldLabel">
                                            Industry
                                          </label>
                                          <Field
                                            name={`industry`}
                                            type="text"
                                            component={InputField}
                                          ></Field>
                                        </Col>

                                        <Col
                                          span={6}
                                          className="width-limit-year-found"
                                        >
                                          <label className="fieldLabel">
                                            Year Founded
                                          </label>
                                          <Field
                                            name={`yearFounded`}
                                            type="text"
                                            component={InputField}
                                          ></Field>
                                        </Col>
                                        <Col
                                          span={6}
                                          className="width-limit-year-found"
                                        >
                                          <label className="fieldLabel">
                                            Band Size
                                          </label>
                                          <Field
                                            name={`companySize`}
                                            type="text"
                                            component={InputField}
                                          ></Field>
                                        </Col>
                                      </Row>
                                    </span>
                                    <Divider />
                                    <div className="infoTextrow">
                                      <div>
                                        <p className="headfieldLabel">
                                          Specialties
                                        </p>
                                      </div>
                                      <div className="infoMarginTop">
                                        <p>
                                          <InfoCircleFilled className="infoCircle" />
                                          Separate with a comma
                                        </p>
                                      </div>
                                    </div>

                                    <Row gutter={gutter30}>
                                      <Col span={24}>
                                        <Field>
                                          {() => (
                                            <>
                                              <div className="width-limit-specialties">
                                                <ProfileTagAutocomplete
                                                  tags={tagFormattedDirectors(
                                                    values.specialities
                                                  )}
                                                  onChange={(specialities) => {
                                                    const names =
                                                      specialities.map(
                                                        (specialiti) =>
                                                          specialiti.name
                                                      );
                                                    const fieldName =
                                                      "specialities";
                                                    handleChangeMultiSelect(
                                                      names,
                                                      fieldName,
                                                      setFieldValue,
                                                      "specialities"
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </Field>
                                      </Col>
                                    </Row>
                                    <Divider />
                                    <div className="infoTextrow">
                                      <div>
                                        <p className="headfieldLabel">
                                          Past Clients
                                        </p>
                                      </div>
                                      <div className="infoMarginTop">
                                        <p>
                                          <InfoCircleFilled className="infoCircle" />
                                          Separate with a comma
                                        </p>
                                      </div>
                                    </div>

                                    <Row gutter={gutter30}>
                                      <Col span={24}>
                                        <Field>
                                          {() => (
                                            <>
                                              <div className="width-limit-past-client">
                                                <ProfileTagAutocomplete
                                                  tags={tagFormattedDirectors(
                                                    values.pastClients
                                                  )}
                                                  placeholder="Add the Clients you have worked for in the past"
                                                  onChange={(pastClients) => {
                                                    const names =
                                                      pastClients.map(
                                                        (pastclient) =>
                                                          pastclient.name
                                                      );
                                                    const fieldName =
                                                      "pastClients";
                                                    handleChangeMultiSelect(
                                                      names,
                                                      fieldName,
                                                      setFieldValue,
                                                      "pastClients"
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </Field>
                                      </Col>
                                    </Row>
                                    <Divider />
                                    <p className="headfieldLabel">Awards</p>
                                    <FieldArray name="awards">
                                      {(arrayHelpers) => (
                                        <>
                                          {values.awards?.map(
                                            (award, index) => (
                                              <Row
                                                gutter={gutter30}
                                                key={index}
                                                className="width-limit-award"
                                              >
                                                <Col span={12}>
                                                  <label className="fieldLabel">
                                                    Award Title
                                                  </label>
                                                  <Field
                                                    name={`awards[${index}].awardTitle`}
                                                    type="text"
                                                    component={InputField}
                                                    onChange={(e) => {
                                                      const fieldName =
                                                        "awardTitle";
                                                      handleChangeField(
                                                        e,
                                                        index,
                                                        fieldName,
                                                        handleChange,
                                                        null,
                                                        "awards"
                                                      );
                                                    }}
                                                  />
                                                </Col>
                                                <Col
                                                  span={6}
                                                  className="width-selected-limit"
                                                >
                                                  <label className="fieldLabel">
                                                    Year
                                                  </label>
                                                  <Select
                                                    style={{ width: "100%" }}
                                                    name={`awards[${index}].awardYear`}
                                                    value={award?.awardYear?.toString()}
                                                    onChange={(e) => {
                                                      const fieldName =
                                                        "awardYear";
                                                      handleChangeField(
                                                        e,
                                                        index,
                                                        fieldName,
                                                        null,
                                                        setFieldValue,
                                                        "awards"
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
                                            )
                                          )}
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
                                    <Divider />
                                    <p className="headfieldLabel">Press</p>
                                    <FieldArray name="presses">
                                      {(arrayHelpers) => (
                                        <>
                                          {values.presses?.map(
                                            (press, index) => (
                                              <Row
                                                gutter={gutter30}
                                                key={index}
                                                className="width-limit-award"
                                              >
                                                <Col span={12}>
                                                  <label className="fieldLabel">
                                                    Title
                                                  </label>
                                                  <Field
                                                    name={`presses[${index}].description`}
                                                    type="text"
                                                    component={InputField}
                                                    onChange={(e) => {
                                                      const fieldName =
                                                        "description";
                                                      handleChangeField(
                                                        e,
                                                        index,
                                                        fieldName,
                                                        handleChange,
                                                        null,
                                                        "presses"
                                                      );
                                                    }}
                                                  />
                                                </Col>
                                                <Col
                                                  span={10}
                                                  className="width-limit-presses"
                                                >
                                                  <label className="fieldLabel">
                                                    Link
                                                  </label>
                                                  <Field
                                                    name={`presses[${index}].url`}
                                                    type="text"
                                                    component={InputField}
                                                    onChange={(e) => {
                                                      const fieldName = "url";
                                                      handleChangeField(
                                                        e,
                                                        index,
                                                        fieldName,
                                                        handleChange,
                                                        null,
                                                        "presses"
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
                                            )
                                          )}
                                          <div className="add-more">
                                            <Button
                                              type="link"
                                              className="addBtn"
                                              onClick={() =>
                                                arrayHelpers.push("")
                                              }
                                            >
                                              <PlusCircleOutlined />
                                              Add Link
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    </FieldArray>
                                  </>
                                </FieldArray>
                              </Panel>
                              </>
                          </Collapse>
                          <Row className='actionRow'>
                          <Col span={24}>
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
                </div>
              </Col>
            </Row>
            {/* DON'T REMOVE As the business member is disabled for now.*/}
            {/* <Row className="section">
              <Col span={24}>
                <h2 className="sectionHead">Business Members </h2>
                <BusinessMemberTable members={memberList}></BusinessMemberTable>
              </Col>
            </Row> */}
          </CompanyProfileWrapper>
        </ProfileLayout>
      </Card>
    </CardWrapper>
  );
};
