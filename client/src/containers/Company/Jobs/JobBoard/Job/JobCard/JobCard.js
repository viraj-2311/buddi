import React, { Fragment, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Card, Dropdown, Menu, Tooltip } from 'antd';
import Button from '@iso/components/uielements/button';
import MoreIcon from '@iso/components/icons/More';
import { CardBody, CardFooter, HrBar } from '../Job.style';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import JobUpdateTypes from '@iso/enums/job_update_types';
import {
  JobAction,
  JobClientName,
  JobCrew,
  JobDetail,
  JobDetailItem,
  JobMoreAction,
  JobStatusBar,
  JobTitle,
} from './JobCard.style';
import { formatDateRange } from '@iso/lib/helpers/utility';
import JobBoardContext from '../../JobBoardContext';
import JobStatus from '@iso/enums/job_status';
import _ from 'lodash';

const JobCard = ({ job, column }) => {
  const { onEdit, onDelete, onOpen, onActivate, onWrap, onArchive } =
    useContext(JobBoardContext);
  const { archiveJob } = useSelector((state) => state.ProducerJob);
  const {
    update: { loading: updateLoading, type: updateType },
  } = useSelector((state) => state.ProducerJob);

  const ActiveJobMoreActions = (
    <Menu>
      <Menu.Item onClick={() => onEdit(job)} key={'edit-job-info'}>
        Edit Gig
      </Menu.Item>
      <Menu.Item onClick={() => onArchive(job)} key={'archive-job'}>
        Archive This Gig
      </Menu.Item>
      <Menu.Item onClick={() => onDelete(job)} key={'delete-job'}>
        Delete
      </Menu.Item>
    </Menu>
  );
  console.log(job);

  return (
    <Card
      style={{
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
      }}
      bodyStyle={{ padding: 20 }}
      bordered={false}
    >
      <CardBody>
        <JobMoreAction>
          <Dropdown
            overlay={ActiveJobMoreActions}
            overlayClassName='jobMenu'
            placement='bottomRight'
            trigger='click'
          >
            <Button type='link'>
              <MoreIcon />
            </Button>
          </Dropdown>
        </JobMoreAction>
        <JobClientName>{job.client}</JobClientName>
        <JobTitle>{(job.agency)? job.agency +' - ': ''}{job.title}</JobTitle>
        <JobStatusBar color={column.color} />
        <JobDetail>
          <JobDetailItem>
            <h3>Gig #</h3>
            <p>{job.jobNumber}</p>
          </JobDetailItem>
          {/* <JobDetailItem>
            <h3>Agency</h3>
            <p>{job.agency}</p>
          </JobDetailItem> */}
          <JobDetailItem>
            <h3>Date</h3>
            <p>{formatDateRange(job.startDate, job.wrapDate)}</p>
          </JobDetailItem>
        </JobDetail>
      </CardBody>
      <HrBar />
      <CardFooter>
        <JobAction>
          <Button
            type='default'
            className='statusActionBtn'
            onClick={() => onOpen(job)}
          >
            Open
          </Button>

          {job.status === JobStatus.HOLDING && (
            <Button
              type='default'
              className='statusActionBtn'
              loading={updateLoading && updateType === JobUpdateTypes.ACTIVATE}
              onClick={() => onActivate(job)}
            >
              Activate
            </Button>
          )}

          {job.status === JobStatus.ACTIVE && (
            <Button
              type='default'
              className='statusActionBtn'
              onClick={() => onWrap(job)}
            >
              Wrap/Pay
            </Button>
          )}

          {job.status === JobStatus.WRAPPED && (
            <Button
              type='default'
              className='statusActionBtn'
              loading={job.id === archiveJob.id && archiveJob.loading}
              onClick={() => onArchive(job)}
            >
              Archive
            </Button>
          )}
        </JobAction>

        <JobCrew color={column.color}>
          Talent(s):
          <span style={{ display: "flex" }}>
            {job.crews &&
              job.crews.length > 0 &&
              _.take(job.crews, 9).map((c) => (
                <Fragment key={c.id}>
                  <Tooltip title={c.fullName} placement='bottomRight'>
                    <img src={c.profilePhotoS3Url || EmptyAvatar} />
                  </Tooltip>
                </Fragment>
              ))}
            {job.crews && job.crews.length > 9 && (
              <a href='#' className='moreCrew'>
                +{job.crews.length - 9}
              </a>
            )}
          </span>
        </JobCrew>
      </CardFooter>
    </Card>
  );
};
export default JobCard;
