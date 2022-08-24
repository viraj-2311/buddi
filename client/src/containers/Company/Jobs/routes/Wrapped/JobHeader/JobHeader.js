import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import JobHeaderWrapper from './JobHeader.style';
import basicStyle from '@iso/assets/styles/constants';
import { Row, Col, Menu, Dropdown } from 'antd';
import Button from '@iso/components/uielements/button';
import StatusTag from '@iso/components/utility/statusTag';
import Icon from '@iso/components/icons/Icon';
import BackIcon from '@iso/components/icons/Back';
import MoreIcon from '@iso/assets/images/more.svg';
import JobBoardContext from '../../../JobBoard/JobBoardContext';
import PaymentStatusTag from './PaymentStatusTag';

const { rowStyle, gutter } = basicStyle;

const WrappedJobHeader = ({ job }) => {
  const history = useHistory();
  const { onArchive, onEdit } = useContext(JobBoardContext);
  const { archiveJob } = useSelector((state) => state.ProducerJob);

  const goBack = () => {
    history.push('../../jobs');
  };

  const WrappedJobMoreActions = (
    <Menu>
      <Menu.Item key={'edit-job-info'} onClick={onEdit}>Edit Gig Info</Menu.Item>
      <Menu.Item key={'archive-job'} onClick={onArchive}>Archive This Gig</Menu.Item>
    </Menu>
  );

  return (
    <JobHeaderWrapper>
      <div className='header-top'>
        <Row style={rowStyle} gutter={gutter}>
          <Col md={12} xs={24}>
            <div className='header-left'>
              <div className='header-title'>
                <div>
                  <StatusTag className='badge'>Wrap/Pay</StatusTag>
                  <PaymentStatusTag />
                </div>
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
              <div className='archive-view'>
                <Button
                  type='default'
                  className='archiveBtn'
                  loading={job.id === archiveJob.id && archiveJob.loading}
                  onClick={onArchive}
                >
                  Archive
                </Button>
                <div className='header-right-action'>
                  <Dropdown
                    overlay={WrappedJobMoreActions}
                    overlayClassName='jobMenu'
                    placement='bottomRight'
                    trigger='click'
                  >
                    <Button type='link'>
                      <Icon image={MoreIcon} width={5} height={20} />
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </JobHeaderWrapper>
  );
};

export default WrappedJobHeader;
