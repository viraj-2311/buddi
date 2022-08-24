import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col } from 'antd';
import Tag from '@iso/components/uielements/tag';
import Loader from '@iso/components/utility/loader';
import Button from '@iso/components/uielements/button';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import { fetchPersonalNetworkUserDetailRequest } from '@iso/redux/personalNetwork/actions';

import UserContactInfo from '../UserContactInfo';
import { SectionRow, UserProfileModalBodyWrapper } from './UserProfile.style';

export default ({ userId, moreBtnClick }) => {
  const [userContactInfoModal, setUserContactInfoModal] = useState(false);

  const dispatch = useDispatch();
  const {
    user,
    detail: { loading, error },
  } = useSelector((state) => state.PersonalNetwork);

  const [action, setAction] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setAction('detail');
    dispatch(fetchPersonalNetworkUserDetailRequest(userId));
  }, [userId]);

  useEffect(() => {
    if (!loading && !error && action === 'detail') {
      setShowLoader(false);
    }

    if (!loading && action === 'detail') {
      setAction('');
    }
  }, [loading, error]);

  const params = {
    slidesPerView: 3,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  if (showLoader) {
    return <Loader />;
  }

  const {
    fullName,
    nickname,
    headline,
    city,
    state,
    profilePhotoS3Url,
    jobTitle,
    linkToWork,
    activeSince,
    educations,
    skills,
    directors,
    productionCompanies,
    advertisingAgencies,
    pastClients,
    awards,
    avatar,
    union,
    presses,
  } = user;

  // console.log(user);

  return (
    <UserProfileModalBodyWrapper>
      <SectionRow className='modalHeader'>
        <Col flex='192px' className='left-col'>
          <div className='userAvatar'>
            <img src={profilePhotoS3Url || EmptyAvatar} alt='User' />
          </div>
        </Col>
        <Col flex='auto' className='title-info'>
          <div className='userInfoWrapper'>
            <div className='userInfo'>
              <div className='basicDetail'>
                <h2 className='personName'>
                  {fullName} {nickname && <span>"{nickname}"</span>}
                </h2>
                <h4 className='personRole'>{jobTitle}</h4>
                {/* <p className="personLocation"> */}
                {/* <span className="vertical-line">{city}</span> */}
                {/* <span className="vertical-line">500+ connections </span> */}
                <Button
                  type='link'
                  className='contactInfo'
                  onClick={() => {
                    setUserContactInfoModal(true);
                  }}
                >
                  Contact Info
                </Button>
                {/* </p> */}
                {linkToWork && (
                  <p className='link'>Links to your work: {linkToWork}</p>
                )}
                <p className='personExtraInfo'>
                  {union && <span>Union Number: {union} </span>}
                  {/* <span className="vertical-line">Union: Yes</span>
                  <span>
                    {activeSince.year && activeSince.month && (
                      <span>
                        Active Since:{' '}
                        {activeSince.year && activeSince.month && (
                          <span>
                            {activeSince.year} - Present (
                            {timeAgo(activeSince.year, activeSince.month)})
                          </span>
                        )}
                      </span>
                    )}
                  </span> */}
                </p>
              </div>
            </div>
            {/* <div className="action">
              <Button type="default" shape="round" className="viewBtn">
                View
              </Button>
              <Button
                type="default"
                shape="round"
                className="moreBtn"
                onClick={moreBtnClick}
              >
                More...
              </Button>
            </div> */}
          </div>
        </Col>
      </SectionRow>
      <div className='otherDetail'>
        {false && (
          <>
            {headline && (
              <SectionRow>
                <Col flex='192px' className='left-col'>
                  <h3>About</h3>
                </Col>
                <Col flex='auto' className='info'>
                  <p>{headline}</p>
                </Col>
              </SectionRow>
            )}
            {educations && educations.length > 0 && (
              <SectionRow>
                <Col flex='192px' className='left-col'>
                  <h3>Education</h3>
                </Col>
                <Col flex='auto' className='info'>
                  {educations.map((education, index) => (
                    <div className='schoolDetails' key={`education-${index}`}>
                      <h4>{education.university}</h4>
                      <p>{education.degree}</p>
                      <p>
                        {education.startYear} - {education.endYear}
                      </p>
                      <p> {education.studyField}</p>
                    </div>
                  ))}
                </Col>
              </SectionRow>
            )}
          </>
        )}

        {false && (
          <>
            {skills &&
              ((skills.primarySkills && skills.primarySkills.length > 0) ||
                (skills.secondarySkills && skills.secondarySkills.length > 0) ||
                (skills.toolsTechnologies &&
                  skills.toolsTechnologies.length > 0)) && (
                <SectionRow>
                  <Col flex='192px' className='left-col'>
                    <h3>
                      Experience <br /> & Skills
                    </h3>
                  </Col>
                  <Col flex='auto' className='info'>
                    {skills.primarySkills && skills.primarySkills.length > 0 && (
                      <div className='skillGroup'>
                        <h4>Primary Skills</h4>
                        {skills.primarySkills.map((skill, i) => (
                          <Tag key={i}>{skill}</Tag>
                        ))}
                      </div>
                    )}
                    {skills.secondarySkills &&
                      skills.secondarySkills.length > 0 && (
                        <div className='skillGroup'>
                          <h4>Secondary Skills</h4>
                          {skills.secondarySkills.map((skill, i) => (
                            <Tag key={i}>{skill}</Tag>
                          ))}
                        </div>
                      )}
                    {skills.secondarySkills &&
                      skills.secondarySkills.length > 0 && (
                        <div className='skillGroup'>
                          <h4>Tools & Technologies</h4>
                          {skills.toolsTechnologies?.map((skill, i) => (
                            <Tag key={i}>{skill}</Tag>
                          ))}
                        </div>
                      )}
                  </Col>
                </SectionRow>
              )}
            {directors &&
              directors.directors &&
              directors.directors.length > 0 && (
                <SectionRow>
                  <Col flex='192px' className='left-col'>
                    <h3>Directors & Producers You Worked With </h3>
                  </Col>
                  <Col flex='auto' className='info'>
                    {/* <Col flex="auto" className="info swiper-slider"> */}
                    {/* <SwiperSlider {...params}>
            {directors.directors.map((d) => (
              <NetworkConnectionCardWrapper key={d}>
                <NetworkConnectionCard networkProfile={d} />
              </NetworkConnectionCardWrapper>
            ))}
            </SwiperSlider> */}
                    {directors.directors.map((d, i) => (
                      <Tag key={i}>{d}</Tag>
                    ))}
                  </Col>
                </SectionRow>
              )}

            {productionCompanies && productionCompanies.length > 0 && (
              <SectionRow>
                <Col flex='192px' className='left-col'>
                  <h3>Production Companies</h3>
                </Col>
                <Col flex='auto' className='info'>
                  {productionCompanies.map((company, i) => (
                    <Tag key={i}>{company}</Tag>
                  ))}
                </Col>
              </SectionRow>
            )}
            {advertisingAgencies && advertisingAgencies.length > 0 && (
              <SectionRow>
                <Col flex='192px' className='left-col'>
                  <h3>Advertising Agencies</h3>
                </Col>
                <Col flex='auto' className='info'>
                  {advertisingAgencies.map((agency, i) => (
                    <Tag key={i}>{agency}</Tag>
                  ))}
                </Col>
              </SectionRow>
            )}
            {pastClients && pastClients.length > 0 && (
              <SectionRow>
                <Col flex='192px' className='left-col'>
                  <h3>Past Clients</h3>
                </Col>
                <Col flex='auto' className='info'>
                  {pastClients.map((client, i) => (
                    <Tag key={i}>{client}</Tag>
                  ))}
                </Col>
              </SectionRow>
            )}
            {awards && awards.length > 0 && (
              <SectionRow>
                <Col flex='192px' className='left-col'>
                  <h3>Awards</h3>
                </Col>
                <Col flex='auto' className='info'>
                  {awards.map((award, i) => (
                    <Tag key={i}>
                      {award.title} - {award.year}
                    </Tag>
                  ))}
                </Col>
              </SectionRow>
            )}
            {presses && presses.length > 0 && (
              <SectionRow>
                <Col flex='192px' className='left-col'>
                  <h3>Press</h3>
                </Col>
                <Col flex='auto' className='last-info pressDetail'>
                  {presses.map((press, i) => (
                    <a key={i} href={press.url} target='_blank'>
                      {press.description}
                    </a>
                  ))}
                </Col>
              </SectionRow>
            )}
          </>
        )}
      </div>
      <UserContactInfo
        user={user}
        visible={userContactInfoModal}
        handleCancel={() => {
          setUserContactInfoModal(false);
        }}
      />
    </UserProfileModalBodyWrapper>
  );
};
