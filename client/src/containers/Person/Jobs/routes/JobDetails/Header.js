import React from 'react';
import { useHistory } from 'react-router';
import ContractorJobDetailsHeaderWrapper from './Header.style';
import basicStyle from '@iso/assets/styles/constants';
import BackIcon from '@iso/components/icons/Back';
import Button from '@iso/components/uielements/button';
import StatusTag from '@iso/components/utility/statusTag';
import ContractorJobStatusColor from '@iso/enums/contractor_job_status_color';
import MemoTypes from '@iso/enums/memo_types';
import JobAcceptanceLevel from "../../components/JobAcceptanceLevel";

const { rowStyle, colStyle, gutter } = basicStyle;

const ContractorJobDetailsHeader = ({ job, actions }) => {
  const { job: producerJob } = job;
  const history = useHistory();
  const goBack = () => {
    history.push('../../jobs');
  };

  const JobStatus = ({ job }) => {
    // if (job.accepted) {
    //   return (
    //     <StatusTag
    //       className="statusBadge"
    //       color={ContractorJobStatusColor.DEAL}
    //     >
    //       Booking Memo
    //     </StatusTag>
    //   );
    // }

    // if (job.decline) {
    //   return (
    //     <StatusTag
    //       className="statusBadge"
    //       color={ContractorJobStatusColor.DECLINED}
    //     >
    //       Declined
    //     </StatusTag>
    //   );
    // }

    // if (job.completed) {
    //   return (
    //     <StatusTag
    //       className="statusBadge"
    //       color={ContractorJobStatusColor.DECLINED}
    //     >
    //       Declined
    //     </StatusTag>
    //   );
    // }

    if (job.memoType === MemoTypes.HOLD) {
      return (
        <StatusTag
          className="statusBadge"
          color={ContractorJobStatusColor.HOLD}
        >
          Hold Memo
        </StatusTag>
      );
    }else if (producerJob.isArchived && producerJob.status === "WRAPPED") {
      return (
        <StatusTag
          className="statusBadge"
          color={ContractorJobStatusColor.COMPLETE}
        >
          Completed
        </StatusTag>
      );
    }
    else if (job.memoType === MemoTypes.DEAL) {
      return (
        <StatusTag
          className="statusBadge"
          color={ContractorJobStatusColor.DEAL}
        >
          Booking Memo
        </StatusTag>
      );
    }

    return null;
  };

  return (
    <ContractorJobDetailsHeaderWrapper>
      <div className="header-top">
        <div className="header-left">
          <Button type="link" onClick={goBack} className="goBackBtn">
            <BackIcon width={12} height={20} />
          </Button>
          <div className="header-title">
            <JobStatus job={job} />
            {/* <JobAcceptanceLevel job={job} /> */}
            {!!job?.canceled && (
              <StatusTag className="statusBadge" color={"#ff5b58"}>
                Canceled
              </StatusTag>
            )}
            {!!job?.paidStatus && (
              <StatusTag className="statusBadge" color={"#19913d"}>
                Paid
              </StatusTag>
            )}
            {!job?.paidStatus && (<JobAcceptanceLevel job={job} />)}
            <h1>{producerJob.client}</h1>
            <p>
              {producerJob.agency} | {producerJob.title}
            </p>
          </div>
        </div>

        <div className="header-right">
          <div className="header-right-text">
            <strong>Gig # </strong>
            <span>{producerJob.jobNumber}</span>
          </div>

          <div className="header-right-action"></div>
        </div>
      </div>
    </ContractorJobDetailsHeaderWrapper>
  );
};

export default ContractorJobDetailsHeader;
