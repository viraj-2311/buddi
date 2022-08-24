import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import UserContactInfo from '@iso/containers/Network/UserContactInfo';
import EditIcon from '@iso/components/icons/Edit';
import Button from '@iso/components/uielements/button';
import Tag from '@iso/components/uielements/tag';
import { Col, Row } from 'antd';
import UserAvatar from '@iso/components/UserAvatar';
import { fetchCompanyDetailRequest } from '@iso/redux/company/actions';
import {
  SectionRow,
  MyCompanyWrapper,
  MyCompanyTitle,
} from './MyCompany.style';

export default () => {
  const editIconColor = '#f48d3a';

  const { companyId } = useSelector((state) => state.AccountBoard);
  const { company: companyDetail } = useSelector((state) => state.Company);
  const dispatch = useDispatch();
  const history = useHistory();

  const [userContactInfoModal, setUserContactInfoModal] = useState(false);
  

  const [company, setCompany] = useState({
    id: companyId,
    type: '',
    title: '',
    owner_email: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    address: '',
    vimeo: '',
    ein: '',
    profilePhotoS3Url: '',
    originProfilePhotoS3Url: '',
    business_type: '',
    summary: '',
    website: '',
    headquarters: '',
    industry: '',
    yearFounded: '',
    companySize: '',
    pastClients: [],
    awards: [],
    presses: [],
    specialities: [],
  });
  console.log(company);
  const handleRedirectionToSettings = (key) => {
    history.push(`/companies/${companyId}/settings`);
  };

  useEffect(() => {
    if (companyDetail) {
      setCompany(companyDetail);
    }
  }, [companyDetail]);

  useEffect(() => {
    dispatch(fetchCompanyDetailRequest(companyId));
  }, [dispatch]);

  const Edit = () => <EditIcon width={18} height={18} fill={editIconColor} />;

  return (
    <MyCompanyWrapper>
      <MyCompanyTitle>
        <SectionRow>
          <Col className='user-avatar-wrapper'>
            <UserAvatar
              size={60}
              title={company?.title}
              url={company?.profilePhotoS3Url}
            />
          </Col>
          <Col flex='auto' className='title-info'>
            <div className='userInfo'>
              <div className='basicDetail'>
                <h2 className='personName'>{company?.title}</h2>
                {company?.type && <h4>{company?.type}</h4>}
                <p>
                  <a
                    onClick={() => {
                      setUserContactInfoModal(true);
                    }}
                  >
                    Contact Info
                  </a>
                </p>
                <p>
                  <h4>
                    {company?.city
                      ? `${company?.city.trim()}${
                          company?.state.trim() || company?.zipCode.trim()
                            ? ','
                            : ''
                        }`
                      : ''}
                    {` `}
                    {company?.state
                      ? `${company?.state.trim()}${
                          company?.zipCode.trim() ? ',' : ''
                        }`
                      : ''}
                    {` `}
                    {company?.zipCode ? `${company?.zipCode.trim()}` : ''}
                  </h4>
                </p>
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
      </MyCompanyTitle>
      {company.summary && (
        <SectionRow>
          <Col flex='192px'>
            <h3>About</h3>
          </Col>
          <Col flex='auto' className='info'>
            <span className='font-tag'>{company.summary}</span>
          </Col>
        </SectionRow>
      )}
      {(company.website ||
        company.industry ||
        company.companySize ||
        company.headquarters ||
        company.yearFounded) && (
        <SectionRow>
          <Col flex='192px'>
            <h3>Overview</h3>
          </Col>
          <Col flex='auto' className='info'>
            {company.website && (
              <div className='tagGroup'>
                <h4>Website</h4>
                <Tag>{company.website}</Tag>
              </div>
            )}
            {company.industry && (
              <div className='tagGroup'>
                <h4>Industry</h4>
                <Tag>{company.industry}</Tag>
              </div>
            )}
            {company.companySize && (
              <div className='tagGroup'>
                <h4>Band size</h4>
                <Tag>{company.companySize}</Tag>
              </div>
            )}
          </Col>
          <Col flex='auto'>
            {company.headquarters && (
              <div className='tagGroup'>
                <h4>Headquarters</h4>
                <Tag>{company.headquarters}</Tag>
              </div>
            )}
            {company.yearFounded && (
              <div className='tagGroup'>
                <h4>Founded</h4>
                <Tag>{company.yearFounded}</Tag>
              </div>
            )}
          </Col>
        </SectionRow>
      )}
      {company.specialities.length > 0 && (
        <SectionRow>
          <Col flex='192px'>
            <h3>Specialties</h3>
          </Col>
          <Col flex='auto' className='info'>
            {company.specialities.map((specialiti) => (
              <Tag>{specialiti}</Tag>
            ))}
          </Col>
        </SectionRow>
      )}
      {company.pastClients.length > 0 && (
        <SectionRow>
          <Col flex='192px'>
            <h3>Past Clients</h3>
          </Col>
          <Col flex='auto' className='info'>
            {company.pastClients.map((pastclients) => (
              <Tag>{pastclients}</Tag>
            ))}
          </Col>
        </SectionRow>
      )}
      {company?.awards.length > 0 && (
        <SectionRow>
          <Col flex='192px'>
            <h3>Awards</h3>
          </Col>
          <div className='tagGroupnew'>
            <Col flex='auto' className='info'>
              {company?.awards?.map((award, i) => (
                <Tag key={i}>
                  {award.awardTitle}-{award.awardYear}
                </Tag>
              ))}
            </Col>
          </div>
        </SectionRow>
      )}
      {company?.presses.length > 0 && (
        <SectionRow>
          <Col flex='192px'>
            <h3>Press</h3>
          </Col>
          <div className='tagGroupnew'>
            <Col flex='auto' className='last-info pressDetail'>
              {company?.presses?.map((press, i) => (
                <a key={i} href={press?.url} target='_blank'>
                  {press.url}
                </a>
              ))}
            </Col>
          </div>
        </SectionRow>
      )}
      <UserContactInfo
        editable
        onEdit={handleRedirectionToSettings}
        user={company || {}}
        visible={userContactInfoModal}
        handleCancel={() => {
          setUserContactInfoModal(false);
        }}
      />
    </MyCompanyWrapper>
  );
};
