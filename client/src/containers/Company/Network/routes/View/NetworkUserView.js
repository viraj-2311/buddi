import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CompanyNetworkUserViewWrapper from './NetworkUserView.style';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import Box from '@iso/components/utility/box';
import ContentHolder from '@iso/components/utility/contentHolder';
import Tag from '@iso/components/uielements/tag';
import Loader from '@iso/components/utility/loader';
import { fetchCompanyNetworkUserDetailRequest } from '@iso/redux/companyNetwork/actions';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import moment from 'moment';

const timeAgo = (year, month) => {
  if (!year || !month) return null;

  const givenTime = moment([year, month]);
  return givenTime.fromNow();
};

const CompanyNetworkUserView = ({ userId }) => {
  const dispatch = useDispatch();
  const {
    user,
    detail: { loading, error },
  } = useSelector((state) => state.CompanyNetwork);

  const [action, setAction] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setAction('detail');
    dispatch(fetchCompanyNetworkUserDetailRequest(userId));
  }, [userId]);

  useEffect(() => {
    if (!loading && !error && action === 'detail') {
      setShowLoader(false);
    }

    if (!loading && action === 'detail') {
      setAction('');
    }
  }, [loading, error]);

  if (showLoader) {
    return <Loader />;
  }

  const {
    headline,
    activeSince,
    educations,
    skills,
    directors,
    productionCompanies,
    advertisingAgencies,
    pastClients,
    awards,
    presses,
  } = user;

  return (
    <CompanyNetworkUserViewWrapper>
      <div className='profileTopHeader'>
        <div className='personImage'>
          <img
            src={user.profilePhotoS3Url ? user.profilePhotoS3Url : EmptyAvatar}
          />
        </div>

        <div className='personInfoWrapper'>
          <h4 className='personName'>
            {user.firstName} {user.lastName}
          </h4>
          <p className='personRole'>{user.jobTitle}</p>
          <p className='personLocation'>
            {user.city}, {user.state}
          </p>
          <div className='personExtraInfo'>
            <p>Nickname: {user.nickname}</p>
            <p>Union: {user.union}</p>
            <p>DOB: {formatDateString(user.birthday, displayDateFormat)}</p>
            <p>Vimeo: {user.vimeo}</p>
            <p>Website: {user.website}</p>
          </div>
        </div>
      </div>

      <Box title='About'>
        <ContentHolder>{headline}</ContentHolder>
      </Box>

      <Box title='Active Since'>
        <ContentHolder>
          {activeSince.year && activeSince.month && (
            <span>
              {activeSince.year} - Present (
              {timeAgo(activeSince.year, activeSince.month)})
            </span>
          )}
        </ContentHolder>
      </Box>

      <Box title='Education' className='educationSection'>
        <ContentHolder>
          {educations.map((education, index) => (
            <div className='schoolDetails' key={`education-${index}`}>
              <p className='degreeName'>
                <strong>
                  {education.degree} in {education.studyField}
                </strong>
              </p>
              <p className='schoolName'>{education.university}</p>
              <p className='schoolFromTo'>
                {education.startYear} - {education.endYear}
              </p>
            </div>
          ))}
        </ContentHolder>
      </Box>

      <Box title='Experience and Skills' className='experienceAndSkillSection'>
        <ContentHolder>
          <div className='skillGroup'>
            <h4 className='groupTitle'>Primary Skills</h4>
            <div className='skillList'>
              {skills.primarySkills.map((skill) => (
                <Tag>{skill}</Tag>
              ))}
            </div>
          </div>
          <div className='skillGroup'>
            <h4 className='groupTitle'>Secondary Skills</h4>
            <div className='skillList'>
              {skills.secondarySkills.map((skill) => (
                <Tag>{skill}</Tag>
              ))}
            </div>
          </div>
        </ContentHolder>
      </Box>

      <Box title='Directors Worked With' className='employmentSection'>
        <ContentHolder>
          <div className='directorGroup'>
            <h4 className='groupTitle'>Directors</h4>
            <div className='directorList'>
              {directors.directors.map((director) => (
                <Tag>{director}</Tag>
              ))}
            </div>
          </div>
          <div className='directorGroup'>
            <h4 className='groupTitle'>Directors of Photography</h4>
            <div className='directorList'>
              {directors.directorsPhotography.map((director) => (
                <Tag>{director}</Tag>
              ))}
            </div>
          </div>
        </ContentHolder>
      </Box>

      <Box title='Production Companies' className='companySection'>
        <ContentHolder>
          {productionCompanies.map((company) => (
            <Tag>{company}</Tag>
          ))}
        </ContentHolder>
      </Box>

      <Box title='Advertising Agencies' className='adAgencySection'>
        <ContentHolder>
          {advertisingAgencies.map((agency) => (
            <Tag>{agency}</Tag>
          ))}
        </ContentHolder>
      </Box>

      <Box title='Past Clients' className='clientSection'>
        <ContentHolder>
          {pastClients.map((client) => (
            <Tag>{client}</Tag>
          ))}
        </ContentHolder>
      </Box>

      <Box title='Awards' className='awardsSection'>
        <ContentHolder>
          {awards.map((award) => (
            <Tag>
              {award.title} - {award.year}
            </Tag>
          ))}
        </ContentHolder>
      </Box>

      <Box title='Press' className='pressesSection'>
        <ContentHolder>
          {presses.map((press) => (
            <a href={press} className='link' target='_blank'>
              {press}
            </a>
          ))}
        </ContentHolder>
      </Box>
    </CompanyNetworkUserViewWrapper>
  );
};

export default CompanyNetworkUserView;
