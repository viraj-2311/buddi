import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import JobDepartmentList from '../../JobDetails/DepartmentList';
import { JobCrewWrapper, AddDepartment } from '../../JobDetails/JobCrew.style';
import MemoForm from '../../JobDetails/MemoForm';
import StyledMemoModal from '../../JobDetails/MemoForm/MemoForm.style';
import Input from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import ClickAwayListener from '@iso/components/ClickAwayListener';
import Loader from '@iso/components/utility/loader';
import { LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ConfirmIcon from '@iso/components/icons/Confirm';
import notification from '@iso/components/Notification';
import {
  fetchJobDetailsRequest,
  getContractorsWithMemo,
  fetchJobRoleGroupsRequest,
  fetchJobMemosRequest,
  getContractorsWithoutMemo,
  swapJobMemoRequest,
  createJobMemoRequest,
  updateJobMemoRequest,
  cancelJobMemoRequest,
  closeDealMemo,
  createJobRoleGroupRequest,
  updateJobRoleGroupRequest,
  updateJobRoleGroupOrderRequest,
  setCrewOpenDepartments,
} from '@iso/redux/producerJob/actions';
import MemoTypes from '@iso/enums/memo_types';
import { uploadFile } from '@iso/lib/helpers/s3';
import { showSuccess } from '@iso/redux/modal/actions';
import { showServerError, reorder } from '@iso/lib/helpers/utility';
import notify from '@iso/lib/helpers/notify';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import CrewHeader from './CrewHeader';
import BookCrew from './BookCrew/BookCrew';
import { GlobalModalContext } from '../../../../../../components/GlobalModal/GlobalModalContext';
import emptyCrewErrorModalProps from '../../../EmptyCrewErrorModal/emptyCrewErrorModalProps';

const moment = extendMoment(Moment);

const ActiveCrew = () => {
  const dispatch = useDispatch();  
  const {
    companyId,
    contractor,
    crewOpenDepartments,
    job,
    jobRoleGroups,
    jobMemos,
    visibleDealMemo,
    jobFullView,
  } = useSelector((state) => state.ProducerJob);
  const { initGlobalModal } = React.useContext(GlobalModalContext);
  const {
    loading: memoCreateLoading,
    error: memoCreateError,
    createdMemo,
  } = useSelector((state) => state.ProducerJob.memoCreate);
  const {
    loading: memoUpdateLoading,
    error: memoUpdateError,
    updatedMemo,
  } = useSelector((state) => state.ProducerJob.memoUpdate);
  const { loading: memoCancelLoading, error: memoCancelError } = useSelector(
    (state) => state.ProducerJob.memoCancel
  );
  const { error: departmentCreateError, loading: departmentCreateLoading } =
    useSelector((state) => state.ProducerJob.jobRoleGroupCreate);
  const { invitees } = useSelector((state) => state.User.invite);
  const {
    jobDetailLoading,
    jobMemosLoading,
    contractorsLoading,
    jobRoleGroupsLoading,
  } = useSelector((state) => {
    return {
      jobDetailLoading: state.ProducerJob.detail.loading,
      jobMemosLoading: state.ProducerJob.memoList.loading,
      contractorsLoading: state.ProducerJob.contractorList.loading,
      jobRoleGroupsLoading: state.ProducerJob.jobRoleGroupList.loading,
    };
  });

  const [addDepartmentRequest, setAddDepartmentRequest] = useState(false);
  const [editable, setEditable] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [input, setInput] = useState('');
  const [lastMemo, setLastMemo] = useState(null);
  const [action, setAction] = useState('');
  const [innerJobRoleGroups, setInnerJobRoleGroups] = useState([]);
  const [visibleBookCrew, setVisibleBookCrew] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState({});

  const refreshLoading = useMemo(() => {
    return (
      jobDetailLoading ||
      jobMemosLoading ||
      contractorsLoading ||
      jobRoleGroupsLoading
    );
  }, [
    jobDetailLoading,
    jobMemosLoading,
    contractorsLoading,
    jobRoleGroupsLoading,
  ]);

  useEffect(() => {
    if (job && job.id) {
      dispatch(fetchJobRoleGroupsRequest(job.id));
      dispatch(fetchJobMemosRequest(job.id));
      dispatch(getContractorsWithMemo(job.id));
      dispatch(getContractorsWithoutMemo(job.id));
      setAction('refresh');
    }
  }, [job]);

  useEffect(() => {
    if (!refreshLoading && action === 'refresh') {
      setShowLoader(false);
      setAction('');
    }
  }, [refreshLoading]);

  useEffect(() => {
    if (invitees.length > 0) {
      const successInvites = invitees.filter((invitee) => invitee.success);
      if (successInvites.length === 0) return;

      dispatch(getContractorsWithoutMemo(job.id));
    }
  }, [invitees]);

  useEffect(() => {
    if (action === 'create' && !memoCreateLoading && !memoCreateError) {
      dispatch(closeDealMemo());
      dispatch(
        showSuccess({
          props: {
            title: 'Congratulations',
            description:
              'You have successfully saved this booking memo in the Book Talent page. Proceed to Book Talent to confirm your booking.',
          },
        })
      );
      setLastMemo(createdMemo);
      fetchJobDetails();
    }

    if (action == 'create' && !memoCreateLoading) {
      setAction('');
    }
  }, [memoCreateLoading, memoCreateError]);

  useEffect(() => {
    if (action === 'update' && !memoUpdateLoading && !memoUpdateError) {
      setLastMemo(updatedMemo);
      fetchJobDetails();
    }

    if (action === 'update' && !memoUpdateLoading) {
      setAction('');
    }
  }, [memoUpdateLoading, memoUpdateError]);

  useEffect(() => {
    if (action === 'cancel' && !memoCancelLoading && !memoCancelError) {
      dispatch(closeDealMemo());
      fetchJobDetails();
      dispatch(showSuccess({ props: cancelSuccess }));
    }

    if (action === 'cancel' && !memoCancelLoading) {
      setAction('');
    }
  }, [memoCancelLoading, memoCancelError]);

  useEffect(() => {
    if (
      addDepartmentRequest &&
      !departmentCreateLoading &&
      !departmentCreateError
    ) {
      setInput('');
      setAddDepartmentRequest(false);
      setEditable(false);
    }

    if (addDepartmentRequest && departmentCreateError) {
      notification('error', showServerError(departmentCreateError));
    }
  }, [departmentCreateLoading, departmentCreateError]);

  useEffect(() => {
    setInnerJobRoleGroups(_.sortBy(jobRoleGroups, 'order'));
  }, [jobRoleGroups]);

  const fetchJobDetails = useCallback(() => {
    setShowLoader(false);
    dispatch(fetchJobDetailsRequest({ id: job.id }));
  }, [job]);

  const defaultMemoValues = useMemo(() => {
    let values = {};
    if (lastMemo) {
      values = { ...values, city: lastMemo?.city, state: lastMemo?.state, payTerms: lastMemo?.payTerms };
    } else {
      values = { ...values, city: job?.city, state: job?.state, payTerms: job?.payTerms };
    }

    if (job.startDate && job.wrapDate) {
      const dates = Array.from(
        moment.range(moment(job.startDate), moment(job.wrapDate)).by('day')
      );
      const dateStrings = dates.map((date) => date.format('YYYY-MM-DD'));
      values = { ...values, shootDates: dateStrings };
    }
    if(job.setTime) {
      values = {...values , setTime:job.setTime };
    }
    if(job.soundCheckTime) {
      values = {...values , soundCheckTime:job.soundCheckTime };
    }
    return values;
  }, [lastMemo, job.startDate, job.wrapDate,job.setTime,job.soundCheckTime]);

  const handleStartEditable = () => setEditable(true);

  const handleStopEditable = () => setEditable(false);

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      setAddDepartmentRequest(true);
      dispatch(
        createJobRoleGroupRequest({
          title: input,
          description: input,
          companyId,
          job: job.id,
        })
      );
    } else if (event.keyCode === 27) {
      setInput('');
      setEditable(false);
    }
  };

  const handleChangeInput = (event) => {
    setInput(event.target.value);
  };

  const firstCrewList = useMemo(() => {
    return innerJobRoleGroups.map((group) => {
      return group.jobRolesList.map((jobRole) => {
        return (
          jobMemos.find(
            (memo) => memo.jobRoleId === jobRole.id && memo.choiceLevel === 1
          ) || null
        );
      });
    });
  }, [innerJobRoleGroups, jobMemos]);

  const secondCrewList = useMemo(() => {
    return innerJobRoleGroups.map((group) => {
      return group.jobRolesList.map((jobRole) => {
        return (
          jobMemos.find(
            (memo) => memo.jobRoleId === jobRole.id && memo.choiceLevel === 2
          ) || null
        );
      });
    });
  }, [innerJobRoleGroups, jobMemos]);

  const thirdCrewList = useMemo(() => {
    return innerJobRoleGroups.map((group) => {
      return group.jobRolesList.map((jobRole) => {
        return (
          jobMemos.find(
            (memo) => memo.jobRoleId === jobRole.id && memo.choiceLevel === 3
          ) || null
        );
      });
    });
  }, [innerJobRoleGroups, jobMemos]);

  const renderDealMemoModal = () => {
    return (
      <StyledMemoModal
        visible={visibleDealMemo}
        width={950}
        wrapClassName='hCentered'
      >
        <MemoForm
          memoType={MemoTypes.DEAL}
          job={job}
          contractor={contractor}
          defaultValues={defaultMemoValues}
          onSubmit={saveDealMemo}
          onCancel={cancelDealMemo}
          onClose={closeDealMemoModal}
        />
      </StyledMemoModal>
    );
  };

  const saveDealMemo = async (memoData) => {
    const memo = jobMemos.find((jobMemo) => jobMemo.id === memoData.memoId);
    const formData = {
      ...memoData,
      jobId: job.id,
      choiceLevel: contractor.choiceLevel,
      jobRole: contractor.jobRole.id,
      jobRoleTitle: memoData.position,
    };

    if (memoData.attachments && memoData.attachments.length > 0) {
      const attachments = [...memoData.attachments];
      const queue = [];
      attachments.map((attachment, index) => {
        if (attachment instanceof File) {
          const memoAttachmentDirName =
            process.env.REACT_APP_S3_BUCKET_MEMO_ATTACHMENT_DIRNAME;
          queue.push(
            uploadFile(attachment, memoAttachmentDirName).then((document) => {
              if (document.location) {
                attachments[index] = {
                  name: attachment.name,
                  size: attachment.size,
                  type: attachment.type,
                  path: document.location,
                };
              }
            })
          );
        }
      });

      await Promise.all(queue)
        .then(() => (formData.attachments = [...attachments]))
        .catch((err) => notify('error', err.message));
    }

    if (!memo) {
      setAction('create');
      dispatch(createJobMemoRequest(job, formData));
    } else {
      setAction('update');
      dispatch(updateJobMemoRequest(memo.id, formData));
    }
  };

  const cancelDealMemo = (memo) => {
    setAction('cancel');
    if (memo.booked) {
      setCancelSuccess({
        title: 'Memo Cancelled',
        customIcon: (
          <ConfirmIcon width={62} height={62} fill='none' stroke='#eb5757' />
        ),
        description: 'Notification sent via email',
      });
    } else {
      setCancelSuccess({
        title: 'Memo Cancelled',
        customIcon: (
          <ConfirmIcon width={62} height={62} fill='none' stroke='#eb5757' />
        ),
      });
    }

    dispatch(cancelJobMemoRequest(memo.id));
  };

  const closeDealMemoModal = () => {
    dispatch(closeDealMemo());
  };

  const dndCrew = (choice, departmentIndex, crewIndex) => {
    let crew = null;
    let choiceLevel = null;

    switch (choice) {
      case 1:
        crew = firstCrewList[departmentIndex][crewIndex];
        choiceLevel = 1;
        break;
      case 2:
        crew = secondCrewList[departmentIndex][crewIndex];
        choiceLevel = 2;
        break;
      case 3:
        crew = thirdCrewList[departmentIndex][crewIndex];
        choiceLevel = 3;
        break;
      default:
        break;
    }

    return { crew, choiceLevel };
  };

  // Drag and Drop functionality
  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) {
      console.log('No destination');
      return;
    }

    if (type === 'CREW') {
      const fromDepartmentIndex = +source.droppableId.split('_')[1];
      const toDepartmentIndex = +destination.droppableId.split('_')[1];

      if (fromDepartmentIndex !== toDepartmentIndex) {
        console.log('Not allow in different department');
        return;
      }

      const fromCrewIndex = +source.index;
      const toCrewIndex = +destination.index;

      if (
        source.droppableId === destination.droppableId ||
        fromCrewIndex !== toCrewIndex
      ) {
        console.log('Not allow in different position');
        return;
      }

      const fromChoiceNumber = +source.droppableId.split('_')[2];
      const toChoiceNumber = +destination.droppableId.split('_')[2];

      const { crew: from, choiceLevel: fromChoiceLevel } = dndCrew(
        fromChoiceNumber,
        fromDepartmentIndex,
        fromCrewIndex
      );
      const { crew: to, choiceLevel: toChoiceLevel } = dndCrew(
        toChoiceNumber,
        toDepartmentIndex,
        toCrewIndex
      );
      const payload = _.cloneDeep({ from, to, fromChoiceLevel, toChoiceLevel });
      dispatch(swapJobMemoRequest(job.id, payload));
    } else if (type === 'DEPARTMENT') {
      const fromDepartmentIndex = +source.index;
      const toDepartmentIndex = +destination.index;
      setInnerJobRoleGroups(
        reorder(innerJobRoleGroups, fromDepartmentIndex, toDepartmentIndex)
      );
      dispatch(
        updateJobRoleGroupOrderRequest(job.id, {
          origin: fromDepartmentIndex + 1,
          destination: toDepartmentIndex + 1,
        })
      );
    }
  };

  const handleDepartmentSelect = (department, selected) => {
    dispatch(updateJobRoleGroupRequest(department.id, { selected: selected }));
    const newJobRoleGroups = innerJobRoleGroups.map((jobRoleGroup) => {
      return jobRoleGroup.id === department.id
        ? { ...jobRoleGroup, selected: selected }
        : jobRoleGroup;
    });
    setInnerJobRoleGroups(newJobRoleGroups);
  };

  const openBookCrew = () => {
    if (!jobFullView || jobFullView.length == 0) {      
      initGlobalModal({
        ...emptyCrewErrorModalProps,
        visible: true,
        onPrimary: () => {
          if (crewOpenDepartments && crewOpenDepartments.length == 0)
            handleToggleExpandCollapse();
        }
      })

    }
    else {
      setVisibleBookCrew(true);
    }
  };

  const handleBookCrew = (data) => {
    if (data.status === 'close') {
      setVisibleBookCrew(false);
      if (data.shouldRefresh) {
        fetchJobDetails();
      }
    }
  };

  const handleToggleExpandCollapse = () => {
    let openKeys = [];
    if (innerJobRoleGroups.length !== crewOpenDepartments.length) {
      openKeys = innerJobRoleGroups.map((jobGroup) => {
        return `job-${job.id}-department-${jobGroup.id}`;
      });
    }
    dispatch(setCrewOpenDepartments(openKeys));
  };

  if (showLoader && refreshLoading) {
    return <Loader />;
  }

  return (
    <JobCrewWrapper>
      <BookCrew
        visible={visibleBookCrew}
        job={job}
        setModalData={handleBookCrew}
      />
      <CrewHeader
        job={job}
        departments={innerJobRoleGroups}
        onDepartmentSelect={handleDepartmentSelect}
        onBookCrew={openBookCrew}
        onToggleExpandCollapse={handleToggleExpandCollapse}
      />

      <div className='jobDetailContent'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='department-list' type='DEPARTMENT'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {innerJobRoleGroups.map((group, index) => {
                  if (!group.selected) return null;
                  return (
                    <JobDepartmentList
                      key={index}
                      departmentIndex={index}
                      jobGroup={group}
                      firstChoice={firstCrewList[index]}
                      secondChoice={secondCrewList[index]}
                      thirdChoice={thirdCrewList[index]}
                      onDepartmentHide={(department) =>
                        handleDepartmentSelect(department, false)
                      }
                    />
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <AddDepartment>
          {editable && (
            <div className='departmentEditorWrapper'>
              <ClickAwayListener onClickAway={handleStopEditable}>
                <Input
                  value={input}
                  style={{ width: 300 }}
                  onKeyUp={handleKeyUp}
                  onChange={handleChangeInput}
                  autoFocus
                  suffix={
                    addDepartmentRequest && !departmentCreateError ? (
                      <LoadingOutlined />
                    ) : null
                  }
                />
              </ClickAwayListener>
            </div>
          )}
          <Button type='link' onClick={handleStartEditable}>
            <PlusCircleOutlined /> Create Department
          </Button>
        </AddDepartment>
        {renderDealMemoModal()}
      </div>
    </JobCrewWrapper>
  );
};

export default ActiveCrew;
