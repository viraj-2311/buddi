import React from 'react';
import { Empty } from 'antd';
import Location from '@iso/components/icons/Location';
import JobItemWrapper from './JobItem.style';
import StatusTag from '@iso/components/utility/statusTag';
import { formatTimeString, formatDateString } from '@iso/lib/helpers/utility';

const jobTextMargin = {
  marginLeft: '5px'
};

const callsheetTitleWithStatus = {
  display: 'flex',
  alignItems: 'center'
};

const JobCallsheetItem = ({ jobCallsheet, onOpen }) => {
  const { job, callsheet} = jobCallsheet;

  const handleClick = () => {
    if (onOpen) onOpen(jobCallsheet);
  };

  return(
    <JobItemWrapper onClick={handleClick}>
      <div className="job-photo-wrapper">
        { job.clientLogoS3Url
          ? (<img src={job.clientLogoS3Url} className="job-photo" />)
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-photo" />}
      </div>
      <div className="jobContent">
        <div className="jobTitle" style={callsheetTitleWithStatus}>
          <span style={{marginRight: '15px'}}>{job.title} - {job.client}</span>
          {jobCallsheet.accepted ? <StatusTag className="success">Accepted</StatusTag> : <StatusTag className="warning">Pending</StatusTag> }
        </div>
        <div className="jobText">
          <div className="inlineText">
            <Location width={12} height={16}/>
            <span style={jobTextMargin}>{callsheet.location.city}, {callsheet.location.state}</span>
          </div>
          <div className="inlineText">
            Time - {formatTimeString(callsheet.time, 'hh:mm A')}
          </div>
        </div>
        <div className="jobText">
          <div className="blockText">Gig ID<br/>#{job.companyJobNumber}</div>
          <div className="blockText" style={jobTextMargin}>Serial No<br/>{job.benjiJobNumber}</div>
          <div className="blockText" style={jobTextMargin}>Date<br/>{formatDateString(callsheet.date, 'LL')}</div>
        </div>
      </div>
    </JobItemWrapper>
  );
};

export default JobCallsheetItem;
