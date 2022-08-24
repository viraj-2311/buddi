import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import _ from 'lodash';
import Modal from '@iso/components/Modal';
import JobReistateForm from './JobReistateForm';
import EmptyAvatar from '@iso/assets/images/empty_avatar.jpg';
import { JobFormWrapper } from './JobReinstate.style';
import { fetchProducersRequest } from '@iso/redux/user/actions';
import {
  createJobRequest,
  updateJobDetailsRequest,
} from '@iso/redux/producerJob/actions';
import validationSchema from './schema';
import { showServerError } from '@iso/lib/helpers/utility';
import notify from '@iso/lib/helpers/notify';
import { fetchJobDetailsRequest } from '@iso/redux/producerJob/actions';
import { fetchCompanyNetworkUsersRequest } from '@iso/redux/companyNetwork/actions';
import { fetchPersonalNetworkUsersRequest } from '@iso/redux/personalNetwork/actions';
import { reinstateJobDetailsRequest } from '../../../../../../redux/producerJob/actions';

const initialValues = {
  agency: '',
  client: '',
  title: '',
  startDate: '',
  wrapDate: '',
  jobNumber: '',
  execProducer: '',
  director: '',
  lineProducer: '',
};

const JobReinstate = ({ visible, job, reinstate, setModalData ,onClose}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { users: corporateNetworkUsers } = useSelector(
    (state) => state.CompanyNetwork
  );
  const { users: personalNetworkUsers } = useSelector(
    (state) => state.PersonalNetwork
  );
  // const { producers } = useSelector((state) => state.User);
  const {
    companyId,    
    reinstate:reinstateReq,
    detail,
    job: jobDetail,
  } = useSelector((state) => state.ProducerJob);
  const [action, setAction] = useState('');

  const producers = useMemo(() => {
    const userList = _.cloneDeep([
      ...corporateNetworkUsers,
      ...personalNetworkUsers,
    ]);
    return userList.map((user) => {
      user.fullName = user.name;
      return user;
    });
  }, [corporateNetworkUsers, personalNetworkUsers]);

  useEffect(() => {
    if (job && job.id) {
      dispatch(fetchJobDetailsRequest({ id: job.id }));
    }
  }, [job]);

  let initials = {
    ...initialValues,
  };

  if (job && job.id) {
    initials = { ...initialValues, id: job.id, ...jobDetail };
  } else {
    initials = { ...initialValues, ...job };
  }

  initials = {
    ...initials,
    ...{
      execProducer : jobDetail?.execProducer && jobDetail?.execProducer?.id ? jobDetail?.execProducer.fullName : jobDetail?.execProducerName ? jobDetail?.execProducerName :'',
      director: jobDetail?.director && jobDetail?.director?.id ? jobDetail?.director.fullName : jobDetail?.directorName ? jobDetail?.directorName : '',
      lineProducer: jobDetail?.lineProducer && jobDetail?.lineProducer?.id ? jobDetail?.lineProducer.fullName : jobDetail?.lineProducerName ? jobDetail?.lineProducerName : '',
    },
  };

  // useEffect(() => {
  //   dispatch(fetchProducersRequest());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCompanyNetworkUsersRequest(companyId));
    dispatch(fetchPersonalNetworkUsersRequest(authUser.id));
  }, [dispatch]);

  // useEffect(() => {
  //   if (!create.loading && !create.error && action === 'job_create') {
  //     notify('success', 'Job created successfully');
  //     setModalData('close');
  //   }

  //   if (create.error && action === 'job_create') {
  //     notify('error', showServerError(create.error));
  //   }

  //   if (!create.loading && action === 'job_create') {
  //     setAction('');
  //   }
  // }, [create]);

  useEffect(() => {    
    if (!reinstateReq.loading && !reinstateReq.error && action === 'job_reinstate') {
      notify('success', 'Job Reinstate successfully');
      setModalData('finish');
    }

    if (reinstateReq.error && action === 'job_reinstate') {
      notify('error', showServerError(reinstateReq.error));
    }

    if (!reinstateReq.loading && action === 'job_reinstate') {
      setAction('');
    }
  }, [reinstateReq]);

  const formatUserOptions = (producers, excluded = []) => {
    const availableProducers = producers.filter(
      (user) => !excluded.includes(user.id)
    );

    return availableProducers.map((user) => ({
      isActive: user.isActive,
      avatar: user.profilePhoto || EmptyAvatar,
      value: user.friendId,
      label: user.name,
    }));
  };

  const userOptions = useMemo(() => {
    if (producers && producers.length) {
      return formatUserOptions(producers, []);
    } else {
      return [];
    }
  }, [producers]);

  const handleCancel = () => {
    onClose();
    // setModalData('close');
  };

  const handleSubmit = (values) => {
    let payload = {
      jobs:[{ ...values }],
      reinstate
    };    
    if (companyId) {
      setAction('job_reinstate');
      dispatch(reinstateJobDetailsRequest(companyId,payload));
    } 
    // else {
    //   // payload.status = type;
    //   setAction('job_create');
    //   dispatch(createJobRequest(companyId, payload));
    // }
  };
  if(!visible) return <></>
  return (
    <Modal
      visible={visible}
      title={`Gig Information`}
      width={950}
      footer={null}
      // wrapClassName='hCentered'
      onCancel={handleCancel}
    >
      <JobFormWrapper>
        <Formik
          enableReinitialize
          initialValues={initials}
          onSubmit={handleSubmit}
          validationSchema={validationSchema()}
          render={(formikProps) => (
            <JobReistateForm
              {...formikProps}
              users={userOptions}
              onCancel={handleCancel}
              action={action}
              loading={detail.loading}
            />
          )}
        />
      </JobFormWrapper>
    </Modal>
  );
};

export default JobReinstate;
