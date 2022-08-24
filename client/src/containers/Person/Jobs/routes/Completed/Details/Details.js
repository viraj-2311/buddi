import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import ContractorCompletedJobDetailsWrapper from './Details.style';
import StyledCard from '../../JobDetails/Card';
import ContractorJobMemo from '../../JobDetails/JobMemo';
import ContractorJobPayment from '../../JobDetails/JobPayment';
import ContractorNetworkUsers from '../../JobDetails/NetworkUsers';
import { ContractorJobAttachments } from '../../JobDetails/JobAttachments';

const CompletedJobDetail = () => {
  const dispatch = useDispatch();
  const { job } = useSelector((state) => state.ContractorJob);

  const { job: producerJob } = job;
  return (
    <ContractorCompletedJobDetailsWrapper>
      <div className="jobMemoWrapper">
        <StyledCard title="Gig Information">
          <Row gutter={30}>
            <Col span={17}>
              <div className="memoAcceptFormWrapper cardWrapper">
                <Row>
                  <Col flex="auto" className="leftFields left-width">
                    <ContractorJobMemo job={job} />
                  </Col>

                  <Col span={7} className="rightFields">
                    <div className="paymentWrapper">
                      <ContractorJobPayment job={job} />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {false && (
              <Col span={7}>
                <div className="networkUserWrapper">
                  <StyledCard title="Crew on This Job">
                    <ContractorNetworkUsers users={job.productionCrews} />
                  </StyledCard>
                </div>
              </Col>
            )}
          </Row>
        </StyledCard>
      </div>
      {job.attachments && job.attachments.length > 0 ? (
      <div className="jobAttachmentWrapper">
        <StyledCard title="Attachments">
          <ContractorJobAttachments attachments={job.attachments} />
        </StyledCard>
      </div>
       ) : null}
      {false && (
        <div className="jobCallsheetWrapper">
          <StyledCard title="Accepted Callsheets"></StyledCard>
        </div>
      )}
    </ContractorCompletedJobDetailsWrapper>
  );
};

export default CompletedJobDetail;
