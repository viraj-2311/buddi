import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import _ from 'lodash';
import Modal from '@iso/components/Modal';
import JobForm from './JobForm';
import EmptyAvatar from '@iso/assets/images/empty_avatar.jpg';
import { JobFormWrapper } from './JobCreateOrUpdate.style';
import { fetchProducersRequest } from '@iso/redux/user/actions';
import {
  createJobRequest,
  createJobReset,
  updateJobDetailsRequest,
} from '@iso/redux/producerJob/actions';
import validationSchema from './schema';
import { showServerError } from '@iso/lib/helpers/utility';
import notify from '@iso/lib/helpers/notify';
import { fetchJobDetailsRequest } from '@iso/redux/producerJob/actions';
import { fetchCompanyNetworkUsersRequest } from '@iso/redux/companyNetwork/actions';
import { fetchPersonalNetworkUsersRequest } from '@iso/redux/personalNetwork/actions';

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
  setTime: '',
  soundCheckTime: ''
};

const JobCreateOrUpdate = ({ visible, job, type, setModalData }) => {
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
    create,
    update,
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

  useEffect(() => {
    if (!create.loading && (create.error === null || create.error === "") && action === 'job_create') {
      notify('success', 'Gig created successfully');
      setModalData('close');
    }

    if ((create.error !== null || create.error !== "") && action === 'job_create') {
      notify('error', showServerError(create.error));
    }

    if (!create.loading && action === 'job_create') {
      setAction('');
    }
  }, [create]);

  useEffect(() => {
    if (!update.loading && (update.error === null || update.error === "") && action === 'job_update') {
      notify('success', 'Gig updated successfully');
      setModalData('close');
    }

    if ((update.error !== null || update.error !== "") && action === 'job_update') {
      notify('error', showServerError(update.error));
    }

    if (!update.loading && action === 'job_update') {
      setAction('');
    }
  }, [update]);

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
    setModalData('close');
  };

  const handleSubmit = async (values, { resetForm }) => {
    
    let payload = { ...values };
    if (job && job.id) {
      setAction('job_update');
      await dispatch(updateJobDetailsRequest(job.id, payload));
      resetForm();
    } else {
      payload.status = type;
      setAction('job_create');
      await dispatch(createJobRequest(companyId, payload));
      resetForm();
    }
  };

  return (
    <Modal
      visible={visible}
      title='Gig Information'
      width={500}
      footer={null}
      wrapClassName='hCentered'
      onCancel={handleCancel}
    >
      <JobFormWrapper>
        <Formik
          enableReinitialize
          initialValues={initials}
          onSubmit={handleSubmit}
          validationSchema={validationSchema()}
          render={(formikProps) => (
            <JobForm
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

export default JobCreateOrUpdate;
