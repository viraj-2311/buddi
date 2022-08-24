import React, {useContext} from "react";
import {Card, Dropdown} from "antd";
import Button from "@iso/components/uielements/button";
import MoreIcon from '@iso/components/icons/More';
import {CardBody, CardFooter, HrBar} from "../Job.style";
import StatusTag from '@iso/components/utility/statusTag';
import MemoTypes from '@iso/enums/memo_types';
import JobStatus from '@iso/enums/job_status';
import {
  JobAction,
  JobClientName,
  JobDetail,
  JobDetailItem,
  JobMoreAction,
  JobStatusBar,
  JobTitle
} from "./JobCard.style";
import {formatDateRange} from '@iso/lib/helpers/utility';
import ContractorJobBoardContext from '../../JobBoardContext';
import JobAcceptanceLevel from "../../../components/JobAcceptanceLevel";

const ContractorJobCard = ({ job: memo, column }) => {
  const { job } = memo;
  const { onOpen } = useContext(ContractorJobBoardContext);

  const JobMemoType = () => {
    if (memo.decline) {
      return null;
    }

    if (memo.job.status === JobStatus.WRAPPED && memo.paidStatus) {
      return <StatusTag className={'badge'} color={'#19913d'}>Paid</StatusTag>
    }

    if (!!memo?.canceled) {
      return <StatusTag className={'badge'} color={'#ff5b58'}>Canceled</StatusTag>
    }

    if (memo.acceptanceLevel && memo.memoType !== MemoTypes.DEAL) {
      return <JobAcceptanceLevel job={memo} />
    }

    if (memo.memoType === MemoTypes.DEAL) {
      return <StatusTag className="badge" color="#51369a">Booking Memo</StatusTag>
    } else {
      return <StatusTag className="badge" color="#ffc06a">Hold Memo</StatusTag>
    }
  };

  return (
    <Card
      style={{
        width: "100%",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
      }}
      bodyStyle={{ padding: 20 }}
      headStyle={{ borderBottom: "none", fontSize: 14, color: "#788195" }}
      bordered={false}
    >
      <CardBody>
        
        <JobClientName>{job.client}</JobClientName>
        <JobTitle>{job.title}</JobTitle>
        <JobStatusBar color={column.color} />
        <JobDetail color={column.color}>
          <JobDetailItem>
            <h3>Gig ID</h3>
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
          <Button type="default" className="statusActionBtn" onClick={() => onOpen(memo)}>
            Open
          </Button>
          <JobMemoType job={job} />
        </JobAction>
      </CardFooter>
    </Card>
  );
};
export default ContractorJobCard;
