import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import Button from '@iso/components/uielements/button';
import Badge from '@iso/components/uielements/badge';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import JobBoardLayout, {
  ParentContainer,
  Container,
  JobHeader,
  JobHeaderAction,
} from './JobBoard.style';
import Column from './JobBoard/Column/Column';
import DeclinedIcon from '@iso/components/icons/Declined';
import ArchivedIcon from '@iso/components/icons/Archived';
import ContractorJobBoardContext from './JobBoard/JobBoardContext';
import Loader from '@iso/components/utility/loader';
import ContractorJobStatus from '@iso/enums/contractor_job_status';
import { fetchContractorJobsRequest } from '@iso/redux/contractorJob/actions';
import { setUserIntroStep } from '@iso/redux/intro/actions';
import { setDisplayBuddiWallet } from '../../../redux/auth/actions';

export default function({ containerHeight, withScrollableColumns = true }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { jobs, list: fetchMemoListRequest } = useSelector(
    (state) => state.ContractorJob
  );
  const { user: authUser } = useSelector((state) => state.Auth);
  const { userStepIntro } = useSelector((state) => state.UserIntro);
  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      title: 'Hold Memo',
      type: ContractorJobStatus.HOLD_MEMO,
      editing: false,
      color: '#ffc06a',
    },
    {
      id: 'column-2',
      title: 'Booking Memo',
      type: ContractorJobStatus.DEAL_MEMO,
      editing: false,
      color: '#51369a',
    },
    {
      id: 'column-3',
      title: 'Completed',
      type: ContractorJobStatus.COMPLETED,
      editing: false,
      color: '#19913d',
    },
  ]);

  useEffect(() => {
    dispatch(fetchContractorJobsRequest(authUser.id));
  }, [authUser]);

  const jobsByStatus = useMemo(() => {
    // const holdMemoJobs = jobs.filter(
    //   (job) => job.booked && !job.accepted && !job.decline
    // );
    // const dealMemoJobs = jobs.filter((job) => job.booked && job.accepted);
    // const completedJobs = [];
    if (
      authUser &&
      authUser.type != null &&
      !authUser.toolTipFinished &&
      authUser.toolTipStep > userStepIntro.currentStepIntro &&
      !fetchMemoListRequest.loading
    ) {
      dispatch(
        setUserIntroStep({
          currentStepIntro: authUser.toolTipStep,
          latestStep: authUser.toolTipStep,
        })
      );
    }

    const filteredJobMemos = jobs.filter(
      (memo) => memo.job.status !== 'ARCHIVED' && !memo.decline
    );

    const holdMemoJobs = filteredJobMemos.filter(
      (jobMemo) =>
        jobMemo.memoType === 'HOLD' &&
        jobMemo.booked &&
        (jobMemo.job.status === 'ACTIVE' || jobMemo.job.status === 'PENDING') &&
        (!jobMemo.completed || !jobMemo.accepted)
    );

    const dealMemoJobs = filteredJobMemos.filter(
      (jobMemo) =>
        jobMemo.memoType === 'DEAL' &&
        jobMemo.booked &&
        (jobMemo.job.status === 'ACTIVE' || jobMemo.job.status === 'WRAPPED') &&
        (!jobMemo.completed || !jobMemo.accepted)
    );

    const completedJobs = filteredJobMemos.filter(
      (jobMemo) => jobMemo.accepted === true && jobMemo.completed === true
    );

    return {
      [ContractorJobStatus.HOLD_MEMO]: holdMemoJobs,
      [ContractorJobStatus.DEAL_MEMO]: dealMemoJobs,
      [ContractorJobStatus.COMPLETED]: completedJobs,
    };
  }, [jobs]);

  const ColumnActions = (type) => {
    if (type === ContractorJobStatus.COMPLETED) {
      if (
        jobsByStatus[ContractorJobStatus.COMPLETED] &&
        jobsByStatus[ContractorJobStatus.COMPLETED].length
      ) {
        return (
          <Link to='/jobs/completed' key={1}>
            <Button type='default' className='viewAllCompleted'>
              View All
            </Button>
          </Link>
        );
      }
    }

    return null;
  };

  const onDragEnd = ({ source, destination, type, draggableId }) => {
    if (!destination) return;
    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    console.log(source, destination, type, draggableId);
  };

  const onJobOpen = (job) => {
    history.push(`./jobs/${job.id}`);
  };

  const board = (
    <ContractorJobBoardContext.Provider
      value={{
        onOpen: onJobOpen,
      }}
    >
      <JobHeader>
        <div className="job-badge">
          <Badge
            offset={[17, 5]}
            count={jobsByStatus[ContractorJobStatus.HOLD_MEMO].length}
          >
            <h1>Gigs</h1>
          </Badge>
        </div>
        <JobHeaderAction>
          {/*<Link to="/callsheets">*/}
          {/*  <Button type="default" className="callSheetBtn">*/}
          {/*    <CallsheetIcon />*/}
          {/*    Callsheet*/}
          {/*  </Button>*/}
          {/*</Link>*/}

          <Link to='/jobs/declined'>
            <Button type='default' className='declinedBtn' size>
              <DeclinedIcon />
              Declined
            </Button>
          </Link>

          {/* <Link to='/jobs/archived'>
            <Button type='default' className='archivedBtn'>
              <ArchivedIcon />
              Archived Gigs
            </Button>
          </Link> */}
        </JobHeaderAction>
      </JobHeader>
      <Droppable
        droppableId='board'
        type='COLUMN'
        direction='horizontal'
        ignoreContainerClipping={Boolean(containerHeight)}
      >
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {columns &&
              columns.map((column, index) => {
                return (
                  <React.Fragment key={column.id}>
                    <Column
                      index={index}
                      title={column.title}
                      column={column}
                      jobs={jobsByStatus[column.type]}
                      isScrollable={withScrollableColumns}
                      actions={ColumnActions(column.type)}
                      currentStepIntro={userStepIntro.currentStepIntro}
                      typeUser={authUser.type}
                    />
                  </React.Fragment>
                );
              })}
          </Container>
        )}
      </Droppable>
    </ContractorJobBoardContext.Provider>
  );

  if (fetchMemoListRequest.loading) {
    return <Loader />;
  }

  return (
    <JobBoardLayout>
      <DragDropContext onDragEnd={onDragEnd}>
        {containerHeight ? (
          <ParentContainer height={containerHeight}>{board}</ParentContainer>
        ) : (
          board
        )}
      </DragDropContext>
    </JobBoardLayout>
  );
}
