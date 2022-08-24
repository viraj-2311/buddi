import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Empty } from 'antd';
import Location from '@iso/components/icons/Location';
import Status from '@iso/components/icons/Status';
import JobItemWrapper from './JobItem.style';
import MemoTypes from '@iso/enums/memo_types';
import { formatDateString, isSequenceDates } from '@iso/lib/helpers/utility';
import { dateFormat, displayDateFormat } from '@iso/config/datetime.config';
import _ from 'lodash';

const jobTextMargin = {
  marginLeft: '5px'
};

const JobItem = ({ job, onOpen }) => {
  const dispatch = useDispatch();
  const { job: producerJob } = job;

  const stringifyJobShootDates = useMemo(() => {
    if (isSequenceDates(producerJob.shootDates)) {
      const minDate = _.min(producerJob.shootDates);
      const maxDate = _.max(producerJob.shootDates);

      return `${formatDateString(minDate, 'MMM Do, YYYY')} - ${formatDateString(maxDate, 'MMM Do, YYYY')}`;
    } else {
      const dateStrings = producerJob.shootDates.map(date => formatDateString(date, 'MMM Do YYYY'));
      return dateStrings.join(', ');
    }
  }, [producerJob]);

  const jobStatus = () => {
    if (job.memoType === MemoTypes.HOLD) {
      return (
        <>
          <Status width={16} height={16} stroke="#f2994a" fill="#f2994a" />
          <span style={jobTextMargin}>Status - Hold Memo</span>
        </>
      )
    } else if (job.memoType === MemoTypes.DEAL) {
      return (
        <>
          <Status width={16} height={16} stroke="#27ae60" fill="#27ae60" />
          <span style={jobTextMargin}>Status - Booking Memo</span>
        </>
      );
    }
  };

  const handleClick = () => {
    if (onOpen) onOpen(job);
  };

  return(
    <JobItemWrapper onClick={handleClick}>
      <div className="job-photo-wrapper">
        { producerJob.clientLogoS3Url
          ? (<img src={producerJob.clientLogoS3Url} className="job-photo" />)
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-photo" />}
      </div>
      <div className="jobContent">
        <h3 className="jobTitle">{producerJob.title} - {producerJob.client}</h3>
        <div className="jobText">
          <div className="inlineText">
            <Location width={12} height={16}/>
            <span style={jobTextMargin}>{job.city}, {job.state}</span>
          </div>
          <div className="inlineText">
            {jobStatus()}
          </div>
        </div>
        <div className="jobText">
          <div className="blockText">Gig ID<br/>#{producerJob.jobNumber}</div>
          <div className="blockText" style={jobTextMargin}>
            Show Dates<br/>
            {stringifyJobShootDates}
          </div>
        </div>
      </div>
    </JobItemWrapper>
  );
};

export default JobItem;
