import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import JobHeaderWrapper from './JobHeader.style';
import basicStyle from '@iso/assets/styles/constants';
import { Row, Col } from 'antd';
import Button from '@iso/components/uielements/button';
import BackIcon from '@iso/components/icons/Back';
import StatusTag from "@iso/components/utility/statusTag";
import JobBoardContext from '../../../../JobBoard/JobBoardContext';
import { useDispatch, useSelector } from 'react-redux';

const { rowStyle, gutter } = basicStyle;

const JobHeader = ({ job,onReinstate=()=>{} }) => {
  const history = useHistory();
  const dispatch = useDispatch();  
  const { companyId } = useSelector((state) => state.ProducerJob);  

  const goBack = () => {
    history.push(`/companies/${companyId}/jobs/archived`);
  };

  return (
    <JobHeaderWrapper>
      <div className='header-top'>
        <Row style={rowStyle} gutter={gutter}>
          <Col md={12} xs={24}>
            <div className='header-left'>
              <div className='header-title'>
                <StatusTag className="ok">Archived</StatusTag>
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
              {/* <Button
                type='default'
                className='reinstate-btn'
                onClick={onReinstate}
              >
                Reinstate
              </Button> */}
            </div>
          </Col>
        </Row>
      </div>      
    </JobHeaderWrapper>
  );
};

export default JobHeader;
