import React, { useMemo } from 'react';
import JobItem from './JobItem';
import JobDetailWrapper, { AcceptanceLevelSpan } from './JobDetail.style';
import NumberFormat from 'react-number-format';
import MemoTypes from '@iso/enums/memo_types';
import HoldLevel from '@iso/enums/hold_level';
import MemoCrewTypes from '@iso/enums/memo_crew_types';
import _ from 'lodash';

const PersonJobDetail = ({ job }) => {
  const { job: producerJob } = job;

  const jobType = useMemo(() => {
    if (job.memoType === MemoTypes.DEAL) {
      return job.memoStaff === MemoCrewTypes.EMPLOYEE
        ? 'BAND STAFF BOOKING MEMO'
        : 'BOOKING MEMO';
    } else if (job.memoType === MemoTypes.HOLD) {
      return job.memoStaff === MemoCrewTypes.EMPLOYEE
        ? 'BAND STAFF HOLD MEMO'
        : 'HOLD MEMO';
    }
  }, [job]);

  const isContractorMemo = useMemo(() => {
    return [MemoCrewTypes.CONTRACTOR_W2, MemoCrewTypes.CONTRACTOR_W9].includes(
      job.memoStaff
    );
    // return [MemoCrewTypes.CONTRACTOR_W9].includes(job.memoStaff);
  }, [job]);

  const superRoleUserName = (role, aliasRole) => {
    if (producerJob[role] && producerJob[role].id) {
      return producerJob[role].fullName;
    }

    return producerJob[aliasRole];
  };

  const humanizeAcceptanceLevel = (level) => {
    switch (level) {
      case 1:
        return 'First Hold';
      case 2:
        return 'Second Hold';
      case 3:
        return 'Third Hold';
    }
  };

  return (
    <JobDetailWrapper>
      <div className='jobSummaryWrapper'>
        <JobItem job={job} />
      </div>
      <div className='divider'></div>
      <div className='jobInfoWrapper'>
        <div className='jobInfoHead'>{jobType}</div>
        <div className='jobInfos'>
          <p className='infoLabel'>Executive Producer</p>
          <p className='infoDetails'>
            {superRoleUserName('execProducer', 'execProducerName')}
          </p>
        </div>
        <div className='jobInfos'>
          <p className='infoLabel'>Director</p>
          <p className='infoDetails'>
            {superRoleUserName('director', 'directorName')}
          </p>
        </div>
        <div className='jobInfos'>
          <p className='infoLabel'>Producer</p>
          <p className='infoDetails'>
            {superRoleUserName('lineProducer', 'lineProducerName')}
          </p>
        </div>
        <div className='jobInfos'>
          <p className='infoLabel'>Job For</p>
          <p className='infoDetails'>{job.fullName}</p>
        </div>
        <div className='jobInfos'>
          <p className='infoLabel'>Department</p>
          <p className='infoDetails'>{job.jobRoleGroup}</p>
        </div>
        <div className='jobInfos'>
          <p className='infoLabel'>Position</p>
          <p className='infoDetails'>{job.jobRole}</p>
        </div>
        <div className='jobInfos'>
          <p className='infoLabel'>Dates</p>
          <p className='infoDetails'>{job.dates}</p>
        </div>
        <div className='jobInfos'>
          <p className='infoLabel'>City</p>
          <p className='infoDetails'>
            {job.city}, {job.state}
          </p>
        </div>

        {isContractorMemo && job.priceType === 'HOURLY' && (
          <div className='jobInfos'>
            <p className='infoLabel'>Day Rate</p>
            <p className='infoDetails'>
              <NumberFormat
                value={job.workingRate}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />{' '}
              Per Day
            </p>
          </div>
        )}
        {isContractorMemo && job.priceType === 'HOURLY' && (
          <div className='jobInfos'>
            <p className='infoLabel'>Working Days</p>
            <p className='infoDetails'>
              <NumberFormat
                value={job.workingDays}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              Days
            </p>
          </div>
        )}
        {isContractorMemo && job.priceType === 'HOURLY' && (
          <div className='jobInfos'>
            <p className='infoLabel'>Kit Fee</p>
            <p className='infoDetails'>
              <NumberFormat
                value={job.kitFee}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </p>
          </div>
        )}
        {isContractorMemo && job.priceType === 'HOURLY' && (
          <div className='jobInfos'>
            <p className='infoLabel'>Total Hours</p>
            <p className='infoDetails'>{job.dailyHours} Set Length</p>
          </div>
        )}
        {isContractorMemo && job.priceType === 'FIXED' && (
          <div className='jobInfos'>
            <p className='infoLabel'>Project Rate</p>
            <p className='infoDetails'>
              <NumberFormat
                value={job.projectRate}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </p>
          </div>
        )}
        {job.memoType === MemoTypes.HOLD && isContractorMemo && (
          <div className='jobInfos'>
            <p className='infoLabel'>Hold Status</p>
            <p className='infoDetails'>
              <AcceptanceLevelSpan
                className='levelNumber'
                color={HoldLevel[job.acceptanceLevel]}
              >
                {job.acceptanceLevel}
              </AcceptanceLevelSpan>
              <span className='levelText'>
                {humanizeAcceptanceLevel(job.acceptanceLevel)}
              </span>
            </p>
          </div>
        )}
        {job.memoType === MemoTypes.DEAL && isContractorMemo && (
          <div className='jobInfos'>
            <p className='infoLabel'>Deal Status</p>
            <p className='infoDetails'>{job.memoStatus}</p>
          </div>
        )}
        <div className='jobInfos'>
          <p className='infoLabel'>Producer's Notes</p>
          <p className='infoDetails'>{job.notes}</p>
        </div>
        {isContractorMemo && (
          <div className='jobInfos'>
            <p className='infoLabel'>Your Notes</p>
            <p className='infoDetails'>{job.optionalMessage}</p>
          </div>
        )}
      </div>
    </JobDetailWrapper>
  );
};

export default PersonJobDetail;
