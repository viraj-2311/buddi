import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'antd';
import ContractorDealMemoJobDetailsWrapper from './Details.style';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import Button from '@iso/components/uielements/button';
import { Textarea } from '@iso/components/uielements/input';
import MemoTypes from '@iso/enums/memo_types';
import MemoCrewTypes from '@iso/enums/memo_crew_types';
import StyledCard from '../../JobDetails/Card';
import ContractorJobMemo from '../../JobDetails/JobMemo';
import ContractorJobPayment from '../../JobDetails/JobPayment';
import ContractorNetworkUsers from '../../JobDetails/NetworkUsers';
import { ContractorJobAttachments } from '../../JobDetails/JobAttachments';
import {
  updateContractorJobRequest,
  acceptOrDeclineJobRequest,
  fetchContractorJobDetailRequest,
  cancelJobRequest,
} from '@iso/redux/contractorJob/actions';
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';
import SuccessModal from '@iso/components/Modals/Success';
import ConfirmModal from '@iso/components/Modals/Confirm';
import cn from 'classnames';

const DealMemoJobDetail = () => {
  const dispatch = useDispatch();
  const {
    job,
    acceptOrDecline: declineRequest,
    update: updateRequest,
  } = useSelector((state) => state.ContractorJob);
  const { user: authUser } = useSelector((state) => state.Auth);
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState({});
  const [confirmDecline, setConfirmDecline] = useState({ visible: false });
  const [confirmcancel, setConfirmCancel] = useState({ visible: false });
  const jobTitle = useMemo(() => {
    return job.memoType === MemoTypes.HOLD ? 'Hold Memo' : 'Booking Memo';
  }, [job]);

  const canUpdate = useMemo(() => {
    return (
      job.canHandleMemo &&
      job.memoType === MemoTypes.HOLD &&
      job.memoStaff !== MemoCrewTypes.EMPLOYEE &&
      job.canceled
    );
  }, [job]);

  const onCancelClick = () => {
    setConfirmCancel({
      visible: true,
      title: 'Are you sure?',
      description:
        'Do you really want to Cancel the gig? This action cannot be undone.',
      onYes: handleCancel,
      onNo: onCancelAction,
    });
  };

  const onCancelAction = () => {
    setConfirmCancel({ visible: false });
  };

  const handleCancel = () => {
    setAction('cancel');
    const payload = { cancel: true };
    dispatch(cancelJobRequest({ id: job.id, payload }));
    setConfirmCancel({ visible: false });
  };

  const DealMemoCancelButton = (
    <>
      <div className="btn">
      <Row gutter={12}>
          <Button
            block
            className={cn({
              declineBtn: true,
            })}
            type='danger'
            shape='round'
            htmlType='button'
            loading={action == 'cancel'}
            onClick={onCancelClick}
          >
            Cancel Memo
          </Button>
      </Row>
          </div>
    </>
  );

  useEffect(() => {
    if (canUpdate) {
      setFormData({
        acceptanceLevel: job.acceptanceLevel,
        optionalMessage: job.optionalMessage,
      });
    }
  }, [job]);

  useEffect(() => {
    if (!updateRequest.loading && !updateRequest.error && action === 'update') {
      notify('success', 'Memo updated successfully');
    }

    if (updateRequest.error && action === 'update') {
      notify('error', showServerError(updateRequest.error));
    }

    if (!updateRequest.loading && action === 'update') {
      setAction('');
    }
  }, [updateRequest]);

  const handleUpdate = (values) => {
    setAction('update');
    const payload = { ...values };
    dispatch(updateContractorJobRequest(job.id, payload));
  };

  useEffect(() => {
    if (!declineRequest.loading && !declineRequest.error) {
      dispatch(fetchContractorJobDetailRequest(job.id));
      setConfirmDecline({ visible: false });
    }

    if (declineRequest.error) {
      notify('error', showServerError(declineRequest.error));
    }

    if (!declineRequest.loading) {
      setAction('');
    }
  }, [declineRequest]);

  const onDeclineClick = () => {
    setConfirmDecline({
      visible: true,
      title: 'Are you sure?',
      description:
        'Do you really want to Decline the gig? This action cannot be undone.',
      onYes: handleDecline,
      onNo: onDeclineCancel,
    });
  };

  const handleDecline = () => {
    setAction('decline');
    const payload = { accepted: false, decline: true };
    dispatch(acceptOrDeclineJobRequest({ id: job.id, payload }));
  };

  const onDeclineCancel = () => {
    setConfirmDecline({ visible: false });
  };

  const { job: producerJob } = job;

  return (
    <ContractorDealMemoJobDetailsWrapper>
      <ConfirmModal
        visible={confirmDecline.visible}
        width={390}
        title={confirmDecline.title}
        description={confirmDecline.description}
        onYes={confirmDecline.onYes}
        onNo={confirmDecline.onNo}
        confirmLoading={action === 'decline'}
      />
       <ConfirmModal
        visible={confirmcancel.visible}
        width={390}
        title={confirmcancel.title}
        description={confirmcancel.description}
        onYes={confirmcancel.onYes}
        onNo={confirmcancel.onNo}
        confirmLoading={action === 'cancel'}
      />
      <div className='jobMemoWrapper'>
        <StyledCard title={jobTitle}>
          <Row>
            <Col span={24}>
              <div className='memoAcceptFormWrapper cardWrapper'>
                <Formik
                  enableReinitialize
                  initialValues={formData}
                  onSubmit={handleUpdate}
                >
                  {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                      <Row>
                      <div className='leftFields left-width'>
                          <ContractorJobMemo job={job} />

                          {canUpdate && (
                            <div className='formGroup optionalMessage'>
                              <label>Optional Message</label>
                              <Field>
                                {() => (
                                  <Textarea
                                    autoSize={{
                                      minRows: 4,
                                      maxRows: 4,
                                    }}
                                    value={values.optionalMessage}
                                    onChange={(e) => {
                                      setFieldValue(
                                        'optionalMessage',
                                        e.target.value
                                      );
                                    }}
                                  />
                                )}
                              </Field>
                            </div>
                          )}
                        </div>

                        <div className='rightFields'>
                          {canUpdate && (
                            <div className='formGroup'>
                              <RadioGroup
                                type='greenScale'
                                value={values.acceptanceLevel}
                                onChange={(e) =>
                                  setFieldValue(
                                    'acceptanceLevel',
                                    e.target.value
                                  )
                                }
                              >
                                <Radio value={1}>1st Hold</Radio>
                                <Radio value={2}>2nd Hold</Radio>
                                <Radio value={3}>3rd Hold</Radio>
                              </RadioGroup>
                            </div>
                          )}

                          <div className='paymentWrapper'>
                            <ContractorJobPayment job={job} />
                          </div>
                          {(!job.canceled && !job.paidStatus && !job?.completed && !job?.job.isArchived) &&
                            job.accepted && 
                            DealMemoCancelButton}

                          {canUpdate && (
                            <div className='actionBtnWrapper'>
                              <Row gutter={15}>
                                <Col md={11}>
                                  <Button
                                    block
                                    className='declineBtn'
                                    htmlType='button'
                                    shape='round'
                                    loading={action === 'decline'}
                                    onClick={onDeclineClick}
                                  >
                                    Decline
                                  </Button>
                                </Col>
                                <Col md={12}>
                                  <Button
                                    block
                                    className='updateBtn'
                                    type='default'
                                    htmlType='submit'
                                    shape='round'
                                    loading={action === 'update'}
                                  >
                                    Update
                                  </Button>
                                </Col>
                              </Row>
                              <p>
                                Click on Hold, to hold the desired position.
                              </p>
                            </div>
                          )}
                        </div>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>

            {false && (
              <Col span={7}>
                <div className='networkUserWrapper'>
                  <StyledCard title='Talent on This Gig'>
                    <ContractorNetworkUsers users={job.productionCrews} />
                  </StyledCard>
                </div>
              </Col>
            )}
          </Row>
        </StyledCard>
      </div>
      {job.attachments && job.attachments.length > 0 ? (
      <div className='jobAttachmentWrapper'>
        <StyledCard title='Attachments'>
          <ContractorJobAttachments attachments={job.attachments} />
        </StyledCard>
      </div>
      ) : null}
      {false && (
        <div className='jobCallsheetWrapper'>
          <StyledCard title='Accepted Callsheets'></StyledCard>
        </div>
      )}
    </ContractorDealMemoJobDetailsWrapper>
  );
};

export default DealMemoJobDetail;
