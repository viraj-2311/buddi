import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Col } from 'antd';

import Tag from '@iso/components/uielements/tag';
import UserContactInfo from '@iso/containers/Network/UserContactInfo';
import Button from '@iso/components/uielements/button';
import EditIcon from '@iso/components/icons/Edit';
import UserPic1 from '@iso/assets/images/user1.png';
import {
  fetchUserDetailRequest,
  checkSectionToRedirect,
} from '@iso/redux/user/actions';

import {
  SectionRow,
  MyProfileWrapper,
  MyProfileTitle,
} from './MyProfile.style';
import UserAvatar from '@iso/components/UserAvatar';

export default () => {
  const editIconColor = '#f48d3a';

  const dispatch = useDispatch();
  const history = useHistory();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { user: userById } = useSelector((state) => state.User);
  const [userDetail, setUserDetail] = useState({
    headline: '',
    nickname: '',
    website: '',
    fullName: '',
    educations: [],
    skills: {
      primarySkills: { primarySkill: [] },
      secondarySkills: { secondarySkill: [] },
      toolsAndTechnologies: { toolAndTechnology: [] },
    },
    directors: { directors: [] },
    pastClients: [],
    productionCompanies: [],
    advertisingAgencies: [],
    pastClients: [],
    awards: [],
    presses: [],
    union: '',
  });
  const [userContactInfoModal, setUserContactInfoModal] = useState(false);

  useEffect(() => {
    try {
      dispatch(fetchUserDetailRequest(authUser.id));
    } catch (error) {}
  }, [dispatch, authUser]);

  useEffect(() => {
    if (authUser) {
      setUserDetail(userById);
    }
  }, [userById]);

  const handleRedirectionToSettings = (key) => {
    if (key) dispatch(checkSectionToRedirect(key));
    history.push('/settings');
  };

  const Edit = () => <EditIcon width={18} height={18} fill={editIconColor} />;
  
  return (
    <MyProfileWrapper>
      <MyProfileTitle>
        <SectionRow>
          <Col className='user-avatar-wrapper'>
            <UserAvatar
              size={60}
              url={userDetail?.profilePhotoS3Url}
              title={userDetail?.fullName}
            />
          </Col>
          <Col flex='auto' className='title-info'>
            <div className='userInfo'>
              <div className='basicDetail'>
                <h2 className='personName'>
                  {userDetail?.fullName}{' '}
                  <span>
                    {userDetail?.nickname && `"${userDetail?.nickname}"`}
                  </span>
                </h2>
                {userDetail?.jobTitle && (
                  <h4 className='personRole'>{(userDetail?.jobTitle.toUpperCase() == 'COMPANY OWNER' ? 'Band Leader' : userDetail?.jobTitle)}</h4>
                )}
                <p>
                  <a
                    onClick={() => {
                      setUserContactInfoModal(true);
                    }}
                  >
                    Contact Info
                  </a>
                </p>
                {userDetail?.union && (
                  <p>
                    <span>Union Number: {userDetail?.union}</span>
                  </p>
                )}
                {userDetail?.linkToWork && (
                  <p>Links to your work: {userDetail?.linkToWork}</p>
                )}
              </div>
            </div>
          </Col>
          <Col className='edit-info'>
            <Button
              type='link'
              onClick={() => {
                handleRedirectionToSettings();
              }}
            >
              <Edit />
            </Button>
          </Col>
        </SectionRow>
      </MyProfileTitle>
        <>
        {userDetail?.headline && (
          <SectionRow>
            <Col flex='192px'>
              <h3>About</h3>
            </Col>
            <Col flex='auto' className='info'>
              <p>{userDetail?.headline}</p>
            </Col>
          </SectionRow>
          )}

          {userDetail?.educations.length > 0 && (
          <SectionRow>
            <Col flex='192px'>
              <h3>Education</h3>
            </Col>
            <Col flex='auto' className='info'>
              {userDetail?.educations?.map((education, index) => (
                <div className='schoolDetails' key={`education-${index}`}>
                  <h4>{education.university}</h4>
                  <p>
                    {education.degree} in {education.studyField}
                  </p>
                  <p>
                    {education.startYear} - {education.endYear}
                  </p>
                  <p>Activities and Societies: Office of Culture & Arts</p>
                </div>
              ))}
            </Col>
          </SectionRow>
          )}
        </>
        <>
        {(userDetail?.skills?.primarySkills?.primarySkill ||
          userDetail?.skills?.secondarySkills?.secondarySkill ||
          userDetail?.skills?.toolsAndTechnologies?.toolAndTechnology) && (
          <SectionRow>
            <Col flex='192px'>
              <h3>
                Experience <br /> & Skills
              </h3>
            </Col>
            <Col flex='auto' className='info'>
            {userDetail?.skills?.primarySkills?.primarySkill && (
              <div className='tagGroup'>
                <h4>Primary Skills</h4>
                {userDetail?.skills?.primarySkills?.primarySkill?.map(
                  (skill, i) => <Tag key={i}>{skill}</Tag>
                )}
              </div>
              )}
              {userDetail?.skills?.secondarySkills?.secondarySkill && (
              <div className='tagGroup'>
                <h4>Secondary Skills</h4>
                {userDetail?.skills?.secondarySkills?.secondarySkill?.map(
                  (skill, i) => <Tag key={i}>{skill}</Tag>
                )}
              </div>
              )}
              {userDetail?.skills?.toolsAndTechnologies?.toolAndTechnology && (
              <div className='tagGroup'>
                <h4>Tools & Technologies</h4>
                {userDetail?.skills?.toolsAndTechnologies?.toolAndTechnology?.map(
                  (skill, i) => <Tag key={i}>{skill}</Tag>
                )}
              </div>
              )}
            </Col>
          </SectionRow>
          )}
        {(userDetail?.directors?.directors?.length > 0 ||
          userDetail?.producers?.producers?.producer) && (
          <SectionRow>
            <Col flex='192px'>
              <h3>Directors & Talents You Worked With</h3>
            </Col>

            <Col flex='auto' className='info'>
              {userDetail?.directors?.directors?.length > 0 && (
              <div className='tagGroup'>
                <h4>Directors</h4>
                {userDetail?.directors?.directors?.map((director, i) => (
                  <Tag key={i}>{director}</Tag>
                ))}
              </div>
               )}
              {userDetail?.producers?.producers?.producer && (
              <div className='tagGroup'>
                <h4>Talents</h4>
                {userDetail?.producers?.producers?.producer?.map(
                  (producer, i) => <Tag key={i}>{producer}</Tag>
                )}
              </div>
              )}
            </Col>
          </SectionRow>
           )}

          {userDetail?.productionCompanies?.length > 0 && (
          <SectionRow>
            <Col flex='192px'>
              <h3>Production Bands</h3>
            </Col>
            <Col flex='auto' className='info br-none'>
              {userDetail?.productionCompanies?.map((company, i) => (
                <Tag key={i}>{company}</Tag>
              ))}
            </Col>
          </SectionRow>
          )}
          {userDetail?.advertisingAgencies?.length > 0 && (
          <SectionRow>
            <Col flex='192px'>
              <h3>Advertising Agencies</h3>
            </Col>
            <Col flex='auto' className='info br-none'>
              {userDetail?.advertisingAgencies?.map((agency, i) => (
                <Tag key={i}>{agency}</Tag>
              ))}
            </Col>
          </SectionRow>
          )}
          {userDetail?.pastClients?.length > 0 && (
          <SectionRow>
            <Col flex='192px'>
              <h3>Past Clients</h3>
            </Col>
            <Col flex='auto' className='info'>
              {userDetail?.pastClients?.map((client, i) => (
                <Tag key={i}>{client}</Tag>
              ))}
            </Col>
            <Col></Col>
          </SectionRow>
          )}
          {userDetail?.awards?.length > 0 && (
          <SectionRow>
            <Col flex='192px'>
              <h3>Awards</h3>
            </Col>
            <Col flex='auto' className='info'>
              {userDetail?.awards?.map((award, i) => (
                <Tag key={i}>
                  {award.title} - {award.year}
                </Tag>
              ))}
            </Col>
          </SectionRow>
          )}
          {userDetail?.presses?.length > 0 && (
          <SectionRow>
            <Col flex='192px'>
              <h3>Press</h3>
            </Col>
            <Col flex='auto' className='last-info pressDetail'>
              {userDetail?.presses?.map((press, i) => {
                if (press?.url) {
                  return (
                    <a key={i} href={press?.url} target='_blank'>
                      {press?.url}
                    </a>
                  );
                }
              })}
            </Col>
          </SectionRow>
          )}
        </>
      <UserContactInfo
        editable
        onEdit={handleRedirectionToSettings}
        user={userDetail || {}}
        visible={userContactInfoModal}
        handleCancel={() => {
          setUserContactInfoModal(false);
        }}
      />
    </MyProfileWrapper>
  );
};
