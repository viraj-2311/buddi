import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import JobUpdateTypes from "@iso/enums/job_update_types";
import { useHistory } from "react-router";
import { CheckSquareFilled } from "@ant-design/icons";
import Badge from "@iso/components/uielements/badge";
import Button from "@iso/components/uielements/button";
import Loader from "@iso/components/utility/loader";
import ConfirmModal from "@iso/components/Modals/Confirm";
import InvoiceRequest from "./InvoiceRequest";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import JobBoardLayout, {
  ParentContainer,
  Container,
  JobHeader,
  JobHeaderAction,
  AntSelect,
  AntSelectOption,
} from "./JobBoard.style";
import Column from "./JobBoard/Column/Column";
import JobStatus from "@iso/enums/job_status";
import { fetchCompanyJobsRequest } from "@iso/redux/producerJob/actions";
import { updateWrapPaySelectOptionRequest, fetchJobInvoiceMemosInitializeJob, fetchJobDealMemosRequest, sendJobInvoiceRequest} from "@iso/redux/jobInvoice/actions";
import {
  updateJobDetailsRequest,
  updateJobResetRequest,
  deleteJobRequest,
  archiveJobRequest,
} from "@iso/redux/producerJob/actions";
import JobCreateOrUpdate from "./JobBoard/Job/JobCreateOrUpdate/JobCreateOrUpdate";
import JobBoardContext from "./JobBoard/JobBoardContext";
import notify from "@iso/lib/helpers/notify";
import { showServerError } from "@iso/lib/helpers/utility";
import { setCompanyIntroStep } from "@iso/redux/intro/actions";
import ChooseWaysToWrapNPayModal from "./routes/Wrapped/Components/ChooseWaysToWrapNPayModal";
import { GlobalModalContext } from "../../../components/GlobalModal/GlobalModalContext";
import cannotWrapPayModalProps from "./CannotWrapPayModal/cannotWrapPayModalProps";
import ArchivedInbox from "@iso/assets/images/ic_archive_inbox.webp";
import GridView from "@iso/assets/images/ic_grid.webp";
import ListView from "@iso/assets/images/ic_list.webp";
import { SaveFilled } from "@ant-design/icons";
import { createJobReset } from '../../../redux/producerJob/actions';
import _ from 'lodash';
import moment from 'moment';

export default function ({ containerHeight, withScrollableColumns = true }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { initGlobalModal } = React.useContext(GlobalModalContext);
  const {
    companyId,
    jobs,
    list,
    delete: deleteAction,
    archiveJob,
    update,
  } = useSelector((state) => state.ProducerJob);

  const { jobDepartments, fetchDealMemos, sendInvoice } = useSelector((state) => state.JobInvoice);
  const { companyStepIntro } = useSelector((state) => state.UserIntro);
  const { user } = useSelector((state) => state.User);
  const [jobModal, setJobModal] = useState({ visible: false, job: null });
  const [jobConfirm, setJobConfirm] = useState({ visible: false, job: null });
  const [jobMoveBackConfirm, setJobMoveBackConfirm] = useState({
    visible: false,
    jobId: null,
    moveFromType: null,
    moveToType: null,
  });
  const [wrapModal, setWrapModal] = useState({ visible: false, job: null });

  const [job, setJob] = useState({});
  const [currentView,setCurrentView] = useState('grid');
  const [jobMoveWrapConfirm, setJobMoveWrapConfirm] = useState({
    visible: false,
    jobId: null,
    moveFromType: null,
    moveToType: null,
  });
  const [wayToWrap, setWayToWrap] = useState("");
  const [selectOption, setSelectOption] = useState("all");

  const [chooseOptionToWrapNPay, setOptionToWrapNPay] = useState(false);
  const [action, setAction] = useState("");
  const [actionJob, setJobAction] = useState("");
  const [columns, setColumns] = useState([
    {
      id: "column-1",
      addButtonText: "Create New Holding Gig",
      title: "In Bid",
      type: JobStatus.HOLDING,
      color: "#ffc06a",
      action:  'Activate',
      key: 'inbid',
    },
    {
      id: "column-2",
      addButtonText: "Create New Active Gig",
      title: "Active",
      type: JobStatus.ACTIVE,
      color: "#51369a",
      action: "Wrap/Pay",
      key: 'active',
    },
    {
      id: "column-3",
      addButtonText: "Add Wrap/Pay Gig",
      title: "Wrap/Pay",
      type: JobStatus.WRAPPED,
      color: "#19913d",
      action: "Archive",
      key: 'wrap',
    },
  ]);

  useEffect(() => {
    dispatch(fetchCompanyJobsRequest({ companyId }));
    dispatch(fetchJobInvoiceMemosInitializeJob());
    // 51,53,59
    // dispatch(
    //   updateJobDetailsRequest(53, {
    //     originalStatus: 'ARCHIVED',
    //     status: 'WRAPPED',
    //   })
    // );
    // dispatch(
    //   updateJobDetailsRequest(51, {
    //     originalStatus: 'ARCHIVED',
    //     status: 'ACTIVE',
    //   })
    // );
    // dispatch(
    //   updateJobDetailsRequest(59, {
    //     originalStatus: 'ARCHIVED',
    //     status: 'PENDING',
    //   })
    // );
  }, [companyId]);

  useEffect(() => {
    if (!deleteAction.loading && !deleteAction.error && action === "delete") {
      setJobConfirm({ visible: false, job: null });
      notify("success", "Gig deleted successfully");
    }

    if (deleteAction.error && action === "delete") {
      notify("error", showServerError(deleteAction.error));
    }

    if (!deleteAction.loading && action === "delete") {
      setAction("");
    }
  }, [deleteAction]);

  useEffect(() => {
    if (!archiveJob.loading && !archiveJob.error && action === "archive") {
      notify("success", "Gig archived successfully");
    }

    if (archiveJob.error && action === "archive") {
      notify("error", showServerError(archiveJob.error));
    }

    if (!archiveJob.loading && action === "archive") {
      setAction("");
    }
  }, [archiveJob]);

  useEffect(() => {
    if (update?.error) {
      notify("error", showServerError(update?.error));
      dispatch(updateJobResetRequest());
    }
  }, [update]);

  const jobsByStatus = useMemo(() => {
    if (
      user &&
      user.type != null &&
      !user.producerToolTipFinished &&
      user.producerToolTipStep > companyStepIntro.currentCompanyStepIntro &&
      !list.loading
    ) {
      dispatch(
        setCompanyIntroStep({
          currentCompanyStepIntro: user.producerToolTipStep,
          latestStep: user.producerToolTipStep,
        })
      );
    }
    const holdingJobs = jobs.filter((job) => job.status === JobStatus.HOLDING);
    const activeJobs = jobs.filter((job) => job.status === JobStatus.ACTIVE);
    const wrappedJobs = jobs.filter((job) => job.status === JobStatus.WRAPPED);

    return {
      [JobStatus.HOLDING]: holdingJobs,
      [JobStatus.ACTIVE]: activeJobs,
      [JobStatus.WRAPPED]: wrappedJobs,
    };
  }, [jobs]);

  const onhandleSelectOption = (value) => {
    setSelectOption(value);
  }

  const onDragEnd = ({ source, destination, type, draggableId }) => {
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "COLUMN") {
    }

    if (type === "JOB") {
      const jobId = draggableId.match(/\d+$/)[0];
      const moveFrom = columns.find(
        (column) => column.id === source.droppableId
      );
      const moveTo = columns.find(
        (column) => column.id === destination.droppableId
      );
      if (moveTo && moveTo.id == "column-2" && moveFrom.type == "PENDING") {
        setJobMoveBackConfirm({
          visible: true,
          jobId: jobId,
          moveFromType: moveFrom.type,
          moveToType: moveTo.type,
        });
      } else if (moveTo && moveTo.id == "column-3") {
        let j = jobs.filter((job) => job.id == jobId)[0];
        setJob(j);
        if ((j?.crews || []).length == 0) {
          initGlobalModal({
            ...cannotWrapPayModalProps,
            visible: true,
            onPrimary: () => {
              onJobOpen(j);
            },
            onSecondary: () => {
              handleJobArchive(j);
            },
          });
          return;
        }
        setOptionToWrapNPay(true);
        setJobMoveWrapConfirm({
          visible: true,
          jobId: jobId,
          moveFromType: moveFrom.type,
          moveToType: moveTo.type,
        });
        console.log(moveFrom, moveTo);
      } else if (moveTo) {
        dispatch(
          updateJobDetailsRequest(jobId, {
            originalStatus: moveFrom.type,
            status: moveTo.type,
          })
        );
      }
      
    }
  };

  const handleMoveOnWrapPayJob = async () => {
    if (Object.keys(jobMoveWrapConfirm).length) {
      await dispatch(
        updateJobDetailsRequest(jobMoveWrapConfirm?.jobId, {
          originalStatus: jobMoveWrapConfirm.moveFromType,
          status: jobMoveWrapConfirm.moveToType,
        })
      );
    }
    setOptionToWrapNPay(false);
  };

  const onJobCreate = (type) => {
    dispatch(createJobReset())
    setJobModal({ visible: true, job: null, type: type });
  };

  const onJobEdit = (job) => {
    setJobModal({ visible: true, job: job });
  };

  const onJobDelete = (job) => {
    setJobConfirm({ visible: true, job: job });
  };

  const onJobDeleteCancel = () => {
    setJobConfirm({ visible: false, job: null });
  };

  const handleJobDelete = () => {
    setAction("delete");
    dispatch(deleteJobRequest(jobConfirm.job.id));
  };

  const onJobMoveBackCancel = () => {
    setJobMoveBackConfirm({
      visible: false,
      jobId: null,
      moveFromType: null,
      moveToType: null,
    });
  };

  const onJobMoveBackAccept = () => {
    dispatch(
      updateJobDetailsRequest(jobMoveBackConfirm.jobId, {
        originalStatus: jobMoveBackConfirm.moveFromType,
        status: jobMoveBackConfirm.moveToType,
      })
    );
    onJobMoveBackCancel();
  };

  const onJobOpen = (job) => {
    history.push(`./jobs/${job.id}`);
  };

  const handleJobActivate = (job) => {
    if(job.status === JobStatus.HOLDING) {
      setJobMoveBackConfirm({
        visible: true,
        jobId: job?.id,
        moveFromType: JobStatus.HOLDING,
        moveToType: JobStatus.ACTIVE,
      });
    }
    else{
      dispatch(
        updateJobDetailsRequest(
          job.id,
          { originalStatus: job.status, status: JobStatus.ACTIVE },
          JobUpdateTypes.ACTIVATE
        )
      );
    }
  };

  const handleJobWrap = (job) => {
    setJob(job);
    if ((job?.crews || []).length == 0) {
      initGlobalModal({
        ...cannotWrapPayModalProps,
        visible: true,
        onPrimary: () => {
          onJobOpen(job);
        },
        onSecondary: () => {
          handleJobArchive(job);
        },
      });
      return;
    }
    setOptionToWrapNPay(true);
  };

  const handleInvoiceModal = async (type, data) => {
    if (type === "close") {
      setOptionToWrapNPay(true);
      setWrapModal({ visible: false, job: null });
    }

    if (type === "success") {
      setWrapModal({ visible: false, job: null });
      await dispatch(fetchCompanyJobsRequest({ companyId }));
      history.push(`./jobs/${job.id}`);
    }

    setJobMoveWrapConfirm({
      visible: false,
      jobId: null,
      moveFromType: null,
      moveToType: null,
    });
  };

  const handleJobArchive = (job) => {
    setAction("archive");
    dispatch(archiveJobRequest(job.id));
  };

  const handleJobReinstate = (job) => {
    // write reducer action for reinstate
  };

  const handleJobModal = (type, data) => {
    if (type === "close") {
      setJobModal({ visible: false, job: null });
      dispatch(createJobReset())
    }
  };

  const allPositions = useMemo(() => {
    let all = [];
    jobDepartments.map((department) => {
      const ids = department.jobRoles.map((jr) => jr.id);
      all = [...all, ...ids];
    });

    return _.uniq(all);
  }, [jobDepartments]);
  
  useEffect(() => {
    if(!fetchDealMemos.loading && actionJob == 'fetch_deal_memos'){
      const payload = { jobRoles: allPositions, currentDate: moment().format('YYYY-MM-DD') };
      dispatch(sendJobInvoiceRequest(job.id, payload));
      setJobAction('send_invoice');
    }
  }, [fetchDealMemos]);

  useEffect(() => {
    if(!sendInvoice.loading && actionJob == 'send_invoice'){
      dispatch(
        updateJobDetailsRequest(job?.id, {
          originalStatus: "ACTIVE",
          status: "WRAPPED",
        })
      );
      setTimeout(() => {
        history.push(`./jobs/${job.id}`);
        setJobAction('');
      }, 500);
    }
  }, [sendInvoice]);

  if (list.loading) {
    return <Loader />;
  }

  const board = (
    <JobBoardContext.Provider
      value={{
        onCreate: onJobCreate,
        onEdit: onJobEdit,
        onDelete: onJobDelete,
        onOpen: onJobOpen,
        onActivate: handleJobActivate,
        onWrap: handleJobWrap,
        onArchive: handleJobArchive,
        onReinstate: handleJobReinstate,
      }}
    >
      <JobHeader>
        <div className="d-flex align-center">
          <Badge count={jobs.length} offset={[20, 15]}>
            <h1>Gigs</h1>
          </Badge>
          {currentView === "list" && 
          <AntSelect
            onChange= {onhandleSelectOption}
            className="templateSelect"
            suffixIcon={<SaveFilled />}
            defaultValue="all"
          >
            <AntSelectOption key={"all"} value={"all"} label={"All Gigs"} >
              {"All Gigs"}
            </AntSelectOption>
            <AntSelectOption key={"inbid"} value={"inbid"} label={"In Bid"}>
              {"In Bid Gigs"}
            </AntSelectOption>
            <AntSelectOption key={"active"} value={"active"} label={"Active"}>
              {"Active Gigs"}
            </AntSelectOption>
            <AntSelectOption key={"wrap"} value={"wrap"} label={"Wrap/Pay"}>
              {"Wrap/Pay Gigs"}
            </AntSelectOption>
          </AntSelect>}
        </div>
        <div className="d-flex">
          <JobHeaderAction>
            <Link to={`/companies/${companyId}/jobs/archived`}>
              <Button type="default" className="archivedBtn">
                <img src={ArchivedInbox} />
                Archived Gigs
              </Button>
            </Link>
          </JobHeaderAction>
          <div className="page-view-outer">
            <img className= {currentView == 'grid' ? "active" : ''} src={GridView} value='grid' onClick={() => {setCurrentView('grid');setSelectOption('all');}} />
            <img src={ListView} className={currentView == 'list' ? "active" : ''}  onClick={ () =>  {setCurrentView('list'); }}/>
          </div>
        </div>
      </JobHeader>
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="vertical"
        ignoreContainerClipping={Boolean(containerHeight)}
      >
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            <JobCreateOrUpdate
              visible={jobModal.visible}
              job={jobModal.job}
              type={jobModal.type}
              setModalData={handleJobModal}
            />

            <ConfirmModal
              visible={jobConfirm.visible}
              title="Are you sure you want to Delete this Gig?"
              description="You will automatically release all holding talents and this gig will be permanently deleted. This action cannot be undone."
              confirmLoading={action === "delete"}
              onYes={handleJobDelete}
              onNo={onJobDeleteCancel}
            />
            <ConfirmModal
              visible={jobMoveBackConfirm.visible}
              title="Are you sure you want to move this gig to Active?"
              // description="This function will turn any negotiated booking memo into a hold memo status and alert freelancer talents of the change."
              confirmLoading={action === "moveBack"}
              onYes={onJobMoveBackAccept}
              onNo={onJobMoveBackCancel}
            />

            {wrapModal.visible && (
              <InvoiceRequest
                job={wrapModal.job}
                setModalData={handleInvoiceModal}
              />
            )}

            {chooseOptionToWrapNPay && (
              <ChooseWaysToWrapNPayModal
                visible={chooseOptionToWrapNPay}
                setCallback={async (choosed) => {
                  setWayToWrap(choosed);
                  const params = { wrap_and_pay_type: choosed };
                  dispatch(updateWrapPaySelectOptionRequest(job?.id, params));
                  if(choosed !== 1){
                    setWrapModal({ visible: true, job: job });
                    setOptionToWrapNPay(false);
                  } else {
                    setWrapModal({ visible: false, job: null });
                    setOptionToWrapNPay(false);
                    await dispatch(fetchJobDealMemosRequest(job.id));
                    setJobAction('fetch_deal_memos');
                  }
                }}
                onCancel={() => setOptionToWrapNPay(!chooseOptionToWrapNPay)}
              />
            )}

            {columns &&
              columns.filter((item) => (selectOption != 'all' ? item.key === selectOption  : item)).map((column, index) => {
                return (
                  <Column
                    key={index}
                    index={index}
                    viewType={currentView}
                    title={column.title}
                    column={column}
                    jobs={jobsByStatus[column.type]}
                    totalRecord = {jobsByStatus[column.type].length}
                    isScrollable={withScrollableColumns}
                    currentStepIntro={companyStepIntro.currentCompanyStepIntro}
                  />
                );
              })}
          </Container>
        )}
      </Droppable>
    </JobBoardContext.Provider>
  );

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
