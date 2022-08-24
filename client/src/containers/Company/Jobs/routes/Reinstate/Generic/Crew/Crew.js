import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import JobDepartmentList from '../../../JobDetails/DepartmentList';
import { JobCrewWrapper, AddDepartment } from '../../../JobDetails/JobCrew.style';
import StyledMemoModal from '../../../JobDetails/MemoForm/MemoForm.style';
import MemoForm from '../../../JobDetails/MemoForm';
import Input from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import ClickAwayListener from '@iso/components/ClickAwayListener';
import Loader from '@iso/components/utility/loader';
import { LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import notification from '@iso/components/Notification';
import {
  fetchJobDetailsRequest,
  getContractorsWithMemo,
  fetchJobRoleGroupsRequest,
  fetchJobMemosRequest,
  fetchArchiveJobMemosRequest,
  getContractorsWithoutMemo,
  closeDealMemo,
  setCrewOpenDepartments,
} from '@iso/redux/producerJob/actions';
import { showSuccess } from '@iso/redux/modal/actions';
import { showServerError } from '@iso/lib/helpers/utility';
import Moment from 'moment';
  import { extendMoment } from 'moment-range';
import _ from 'lodash';
import CrewHeader from './CrewHeader';
import ReadOnlyModal from '../../ReadOnlyModal/ReadOnlyModal';
import { closeArchivedMemo } from '@iso/redux/producerJob/actions';
  
const moment = extendMoment(Moment);
const ReinstateJobCrew = ({ onReinstate=()=>{}}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false)
  const wrapperRef = useRef();
  const {
    companyId,
    contractor,
    crewOpenDepartments,
    job,
    jobRoleGroups,
    jobMemos,
    visibleArchivedMemo,
  } = useSelector((state) => state.ProducerJob);
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
  const [action, setAction] = useState('');
  const [innerJobRoleGroups, setInnerJobRoleGroups] = useState([]);
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
  const onReadOnlyCallBack = ()=>{
    setVisible(true);
  }
  useEffect(() => {
    if (job && job.id) {
      dispatch(fetchJobRoleGroupsRequest(job.id));
      // dispatch(fetchJobMemosRequest(job.id));
      dispatch(fetchArchiveJobMemosRequest(job.id,job.status));
      // dispatch(getContractorsWithMemo(job.id));
      // dispatch(getContractorsWithoutMemo(job.id));
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

      // dispatch(getContractorsWithoutMemo(job.id));
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
      fetchJobDetails();
    }

    if (action == 'create' && !memoCreateLoading) {
      setAction('');
    }
  }, [memoCreateLoading, memoCreateError]);

  useEffect(() => {
    if (action === 'update' && !memoUpdateLoading && !memoUpdateError) {
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

  const defaultMemoValues = useMemo(() => {
    let values = {};    
    values = { ...values, city: job.city, state: job.state };
    if (job.startDate && job.wrapDate) {
      const dates = Array.from(
        moment.range(moment(job.startDate), moment(job.wrapDate)).by('day')
      );
      const dateStrings = dates.map((date) => date.format('YYYY-MM-DD'));
      values = { ...values, shootDates: dateStrings };
    }

    return values;
  }, [job.startDate, job.wrapDate]);

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

  const handleExpandCollapse = () => {
    let openKeys = [];
    // if (innerJobRoleGroups.length !== crewOpenDepartments.length) {
      openKeys = innerJobRoleGroups.map((jobGroup) => {
        return `job-${job.id}-department-${jobGroup.id}`;
      });
    // }
    dispatch(setCrewOpenDepartments(openKeys));
  };
  const onCloseArchivedMemoModal = () => {    
    dispatch(closeArchivedMemo());
  };
  const renderHoldMemoModal = () => {
    return (
      <StyledMemoModal
        visible={visibleArchivedMemo}
        width={950}
        wrapClassName='hCentered'
      >
        <MemoForm
          job={job}
          readOnly={true}
          onReadOnly={setVisible}
          onReadOnlyCallBack={onReadOnlyCallBack}
          // memoType={MemoTypes.HOLD}
          memoType={job.status}
          contractor={contractor}
          defaultValues={defaultMemoValues}
          // onSubmit={saveHoldMemo}
          // onCancel={cancelHoldMemo}
          onClose={onCloseArchivedMemoModal}
        />
      </StyledMemoModal>
    );
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (wrapperRef.current) {
  //       wrapperRef.current.style.pointerEvents = "none";
  //     }
  //   }, 1000);
  //   return () => {
  //     window.clearInterval(interval);
  //   };
  // }, [])
  if (showLoader && refreshLoading) {
    return <Loader />;
  }

  return (
    <>
      <div 
      // onClick={(e) => {
      //   e.preventDefault();
      //   setVisible(true);
      // }}
      >
        <JobCrewWrapper ref={wrapperRef}>
          <CrewHeader
            job={job}
            departments={innerJobRoleGroups}
            onToggleExpandCollapse={handleExpandCollapse}
            onReadOnly={onReadOnlyCallBack}
          />

          <div className='jobDetailContent'>
            <DragDropContext>
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
                          onDepartmentHide={(department) => { }}
                          readOnly
                          onReadOnly={onReadOnlyCallBack}
                        />
                      );
                    })}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* <AddDepartment>
              {editable && (
                <div className='departmentEditorWrapper'>
                  <ClickAwayListener>
                    <Input
                      value={input}
                      style={{ width: 300 }}
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
              <Button type='link'>
                <PlusCircleOutlined /> Create Department
              </Button>
            </AddDepartment> */}
          </div>
        </JobCrewWrapper>
      </div>
      {renderHoldMemoModal()}
      {
        visible && 
        <ReadOnlyModal {...{ visible, setVisible, onReinstate:()=>{
          setVisible(false);
          onReinstate();
        } }} />
      }
    </>
  );
};

export default ReinstateJobCrew;
