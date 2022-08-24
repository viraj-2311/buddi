import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useHistory } from 'react-router';
import JobHeaderWrapper from './JobHeader.style';
import JobUpdateTypes from '@iso/enums/job_update_types';
import basicStyle from '@iso/assets/styles/constants';
import { Row, Col, Menu, Dropdown } from 'antd';
import Button from '@iso/components/uielements/button';
import Icon from '@iso/components/icons/Icon';
import BackIcon from '@iso/components/icons/Back';
import MoreIcon from '@iso/assets/images/more.svg';
import JobBoardContext from '../../../JobBoard/JobBoardContext';
const { rowStyle, colStyle, gutter } = basicStyle;

const JobHeader = ({ job }) => {
  const {
    update: { loading: updateLoading, type: updateType },
  } = useSelector((state) => state.ProducerJob);

  const { onArchive, onActivate, onDelete, onEdit } =
    useContext(JobBoardContext);

  const history = useHistory();

  const goBack = () => {
    history.push('../../jobs');
  };

  const HoldingJobMoreActions = (
    <Menu>
      <Menu.Item key={'edit-job-info'} onClick={onEdit}>Edit Gig Info</Menu.Item>
      <Menu.Item key={'move-job-to-active'} onClick={onActivate}>Move This Gig to Active</Menu.Item>
      <Menu.Item key={'archive-job'} onClick={onArchive}>Archive This Gig</Menu.Item>
      <Menu.Item key={'delete-job'} onClick={onDelete}>Delete</Menu.Item>
    </Menu>
  );

  return (
    <JobHeaderWrapper>
      <div className='header-top'>
        <Row style={rowStyle} gutter={gutter}>
          <Col md={12} xs={24}>
            <div className='header-left'>
              <div className='header-title'>
                <div className='badge'>Holding</div>
                <h1>
                  <a onClick={goBack}>
                    <BackIcon />
                  </a>
                  {job.client}
                </h1>
                <p>
                  {job.agency} | {job.title}
                </p>
              </div>
            </div>
          </Col>
          <Col md={12} xs={24}>
            <div className='header-right'>
              <div className='header-right-text'>
                <strong>Gig # </strong>
                <span>{job.jobNumber}</span>
              </div>
              <Button
                type='default'
                className='activeJobBtn'
                onClick={onActivate}
                loading = {
                  updateLoading && updateType === JobUpdateTypes.ACTIVATE
                }
              >
                Activate Gig
              </Button>
              <div className='header-right-action'>
                <Dropdown
                  overlay={HoldingJobMoreActions}
                  overlayClassName='jobMenu'
                  placement='bottomRight'
                  trigger='click'
                >
                  <Button type='link'>
                    <Icon image={MoreIcon} />
                  </Button>
                </Dropdown>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </JobHeaderWrapper>
  );
};

export default JobHeader;
