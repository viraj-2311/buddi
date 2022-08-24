import React, {useEffect, useMemo, useRef, useState,} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router';
import {Col, Row} from 'antd';
import {Field, Form, Formik} from 'formik';
import Button from '@iso/components/uielements/button';
import Radio, {RadioGroup} from '@iso/components/uielements/radio';
import {Textarea} from '@iso/components/uielements/input';
import AttachIcon from '@iso/components/icons/Attach';
import ContractorHoldMemoJobDetailsWrapper from './Details.style';
import StyledCard from '../../JobDetails/Card';
import HoldMemoHelperText from '../../JobDetails/HoldMemoHelperText';
import ContractorJobMemo from '../../JobDetails/JobMemo';
import ContractorJobPayment from '../../JobDetails/JobPayment';
import {ContractorJobAttachments, ProducerJobAttachments} from '../../JobDetails/JobAttachments';
import ContractorNetworkUsers from '../../JobDetails/NetworkUsers';
import ConfirmModal from '@iso/components/Modals/Confirm';
import SuccessModal from '@iso/components/Modals/Success';
import MemoTypes from '@iso/enums/memo_types';
import MemoCrewTypes from '@iso/enums/memo_crew_types';
import {uploadFile} from '@iso/lib/helpers/s3';
import {showServerError} from '@iso/lib/helpers/utility';
import notify from '@iso/lib/helpers/notify'; 
import {
  acceptOrDeclineJobRequest,
  fetchContractorJobDetailRequest,
  updateContractorJobRequest,
  cancelJobRequest,
} from '@iso/redux/contractorJob/actions';
import cn from 'classnames';
import {syncAuthUserRequest} from '@iso/redux/auth/actions';
import {fetchAccountJobsRequest} from '@iso/redux/accountBoard/actions';
import _ from 'lodash';

const HoldMemoJobDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    job,
    acceptOrDecline: acceptOrDeclineRequest,
    update: updateRequest,
  } = useSelector((state) => state.ContractorJob);
  const { user: authUser } = useSelector((state) => state.Auth);
  const [action, setAction] = useState('');
  const [visibleHelperText, setVisibleHelperText] = useState(true);
  const [confirmDecline, setConfirmDecline] = useState({ visible: false });
  const [confirmcancel, setConfirmCancel] = useState({ visible: false });
  const [successAccept, setSuccessAccept] = useState({ visible: false });
  const [formData, setFormData] = useState({});

  const filePicker = useRef(null);

  const jobTitle = useMemo(() => {
    return job.memoType === MemoTypes.HOLD ? 'Hold Memo' : 'Booking Memo';
  }, [job]);

  const canUpdate = useMemo(() => {
    return (
      job.canHandleMemo &&
      job.memoType === MemoTypes.HOLD &&
      job.memoStaff !== MemoCrewTypes.EMPLOYEE
    );
  }, [job]);

  useEffect(() => {
    if (canUpdate) {
      setFormData({
        acceptanceLevel: 1,
        optionalMessage: '',
      });
    }
  }, [job]);

  useEffect(() => {
    if (
      !acceptOrDeclineRequest.loading &&
      !acceptOrDeclineRequest.error &&
      action === 'accept'
    ) {
      dispatch(syncAuthUserRequest());
      dispatch(fetchAccountJobsRequest(authUser.id, 'PENDING'));

      if (job.memoType === MemoTypes.DEAL) {
        setSuccessAccept({
          visible: true,
          width: 445,
          bodyStyle: { padding: 40 },
          title: 'Congratulations',
          description: "You have accepted the booking memo and are officially booked for this gig. You can reference this information at any time through the Booking section of your Gigs page. Thank you!",
          onClose: onSuccessAcceptClose,
        });
      } else {
        setSuccessAccept({
          visible: true,
          width: 405,
          title: 'Congratulations',
          description: 'Your hold status was active!',
          onClose: onSuccessAcceptClose,
        });
      }
    }

    if (acceptOrDeclineRequest.error && action === 'accept') {
      notify('error', showServerError(acceptOrDeclineRequest.error));
    }

    if (!acceptOrDeclineRequest.loading && action === 'accept') {
      setAction('');
    }
  }, [acceptOrDeclineRequest]);

  useEffect(() => {
    if (
      !acceptOrDeclineRequest.loading &&
      !acceptOrDeclineRequest.error &&
      action === 'decline'
    ) {
      dispatch(syncAuthUserRequest());
      dispatch(fetchAccountJobsRequest(authUser.id, 'PENDING'));
      setConfirmDecline({ visible: false });
    }

    if (acceptOrDeclineRequest.error && action === 'decline') {
      notify('error', showServerError(acceptOrDeclineRequest.error));
    }

    if (!acceptOrDeclineRequest.loading && action === 'decline') {
      setAction('');
      dispatch(fetchContractorJobDetailRequest(job.id));
    }
  }, [acceptOrDeclineRequest]);

  useEffect(() => {
    if (
      !updateRequest.loading &&
      !updateRequest.error &&
      action === 'update_attachment'
    ) {
    }

    if (updateRequest.error && action === 'update_attachment') {
      notify('error', showServerError(updateRequest.error));
    }

    if (!updateRequest.loading && action === 'update_attachment') {
      setAction('');
    }
  }, [updateRequest]);

  const openFilePicker = () => {
    filePicker.current.value = null;
    filePicker.current.click();
  };

  const goToDocumentSetting = () => {
    history.push("/settings", { state: 'DOCUMENTS'}); 
  };

  const handleAttachmentLoad = async (e) => {
    const files = e.target.files;
    let attachments = [];
    const queue = [];

    Array.from(files).map((file, index) => {
      const memoAttachmentDirName =
        process.env.REACT_APP_S3_BUCKET_MEMO_ATTACHMENT_DIRNAME;
      queue.push(
        uploadFile(file, memoAttachmentDirName).then((document) => {
          if (document.location) {
            attachments.push({
              name: file.name,
              size: file.size,
              type: file.type,
              path: document.location,
            });
          }
        })
      );
    });
    setAction('update_attachment');
    await Promise.all(queue)
      .then(() => {
        const payload = _.cloneDeep({
          attachments: [...attachments],
        });
        dispatch(updateContractorJobRequest(job.id, payload));
      })
      .catch((err) => {
        setAction('');
        notify('error', err.message);
      });
  };

  const handleAttachmentDelete = (attachment) => {
    const filtered = job.attachments.filter((a) => a.id !== attachment.id);
    const payload = _.cloneDeep({ attachments: filtered });
    dispatch(updateContractorJobRequest(job.id, payload));
  };

  const handleAccept = (values) => {
    if (job.memoType === MemoTypes.DEAL && !authUser.w9Document) {
      return notify('error', 'Upload W9 document to Accept the Gig.');
    }
    setAction('accept');
    const payload = { ...values, accepted: true, decline: false };
    dispatch(acceptOrDeclineJobRequest({ id: job.id, payload }));
  };

  const handleDecline = () => {
    setAction('decline');
    const payload = { accepted: false, decline: true };
    dispatch(acceptOrDeclineJobRequest({ id: job.id, payload }));
  };

  const handleCancel = () => {
    setAction('cancel');
    const payload = { cancel: true };
    dispatch(cancelJobRequest({ id: job.id, payload }));
  };

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

  const onCancelClick = () => {
    setConfirmCancel({
      visible: true,
      title: 'Are you sure?',
      description: 'Do you really want to Cancel the gig?',
      onYes: handleCancel,
      onNo: onCancel,
    });
  };

  const onSuccessAcceptClose = () => {
    setSuccessAccept({ visible: false });
    dispatch(fetchContractorJobDetailRequest(job.id));
  };

  const onDeclineCancel = () => {
    setConfirmDecline({ visible: false });
  };

  const onCancel = () => {
    setConfirmCancel({ visible: false });
  };
  const onHelperTextClose = () => {
    setVisibleHelperText(false);
  };

  const filterProducerAttachments = (attachments) => {
    return attachments.filter((attachment) => { return attachment.uploadedBy !== authUser.fullName});
  }

  const filterContractorAttachments = (attachments) => {
    return attachments.filter((attachment) => { return attachment.uploadedBy === authUser.fullName});
  }

  const HoldMemoButtons = (
    <>
      <Row gutter={15}>
        <Col md={11}>
          <Button
            block
            className='declineBtn'
            htmlType='button'
            shape='round'
            loading={action == 'decline'}
            onClick={onDeclineClick}
          >
            Decline
          </Button>
        </Col>
        <Col md={13}>
          <Button
            block
            className='acceptBtn hold'
            type='primary'
            htmlType='submit'
            shape='round'
            loading={action == 'accept'}
          >
            Hold
          </Button>
        </Col>
      </Row>
      <p>Click on Hold to hold the desired position</p>
    </>
  );

  const CancelBottons = (
    <>
      <Row gutter={10}>
        <Col md={13}>
          <Button
            block
            className={cn({
              declineBtn: true,
            })}
            htmlType='button'
            shape='round'
            loading={action == 'cancel'}
            onClick={onCancelClick}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );

  const DealMemoCancelButton = (
    <>
      {' '}
      <Row gutter={10}>
        <Col md={13}>
          <Button
            block
            className={cn({
              declineBtn: true,
            })}
            htmlType='button'
            shape='round'
            loading={action == 'cancel'}
            onClick={onCancelClick}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );

  const DealMemoButtons = (
    <>
      <Row gutter={15}>
        <Col md={11}>
          <Button
            block
            className={cn({
              declineBtn: true,
            })}
            htmlType='button'
            shape='round'
            loading={action == 'decline'}
            onClick={onDeclineClick}
          >
            Decline
          </Button>
        </Col>
        <Col md={13}>
          <Button
            block
            className={cn({
              // disabled: !authUser.w9Document,
              acceptBtn: true,
              deal: true,
            })}
            type='primary'
            htmlType='submit'
            shape='round'
            // disabled={!authUser.w9Document}
            loading={action == 'accept'}
          >
            Accept
          </Button>
        </Col>
      </Row>
    </>
  );

  const { job: producerJob } = job;
  const producerAttachments = filterProducerAttachments(job.attachments);
  const contractorAttachments = filterContractorAttachments(job.attachments);

  return (
    <ContractorHoldMemoJobDetailsWrapper>
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

      <SuccessModal
        visible={successAccept.visible}
        width={successAccept.width}
        bodyStyle={successAccept.bodyStyle}
        title={successAccept.title}
        description={successAccept.description}
        onClose={successAccept.onClose}
      />

      {visibleHelperText && canUpdate && (
        <HoldMemoHelperText onClose={onHelperTextClose} />
      )}
      <div className='jobMemoWrapper'>
        <StyledCard title={jobTitle}>
          <Row>
            <Col span={24}>
              <div className='memoAcceptFormWrapper cardWrapper'>
                <Formik
                  enableReinitialize
                  initialValues={formData}
                  onSubmit={handleAccept}
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
                          <div className='upload-btn-wrapper-outer'>
                          {job.canHandleMemo && (
                            <div className='uploadBtnWrapper'>
                              <Button
                                shape='round'
                                type='default'
                                icon={<AttachIcon width={11} height={20} />}
                                loading={action === 'update_attachment'}
                                onClick={openFilePicker}
                              >
                                <input
                                  ref={filePicker}
                                  type='file'
                                  onChange={handleAttachmentLoad}
                                  multiple
                                />
                                Upload
                              </Button>
                            </div>
                          )}
                          <div className='uploadBtnWrapper'>
                              <Button
                                shape='round'
                                type='default'
                                onClick={goToDocumentSetting}
                              >
                                Upload W9 Document
                              </Button>
                            </div>
                          </div>

                          {
                            job.canHandleMemo &&
                            <ContractorJobAttachments attachments={contractorAttachments} onDelete={handleAttachmentDelete}/>
                          }
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
                          {job.canHandleMemo && (
                            <div className='actionBtnWrapper'>
                              {job.memoType === MemoTypes.HOLD ? (
                                HoldMemoButtons
                              ) : !job.canceled ? (
                                job.accepted ? (
                                  DealMemoCancelButton
                                ) : (
                                  DealMemoButtons
                                )
                              ) : (
                                <></>
                              )}
                            </div>
                          )}
                        </div>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </div>
              {producerAttachments && producerAttachments.length > 0 ? (
              <div className='memoAttachmentWrapper cardWrapper'>
                <StyledCard title='Attachments'>
                  <ProducerJobAttachments
                    attachments={producerAttachments}
                    onDelete={handleAttachmentDelete}
                  />
                </StyledCard>
              </div>
              ) : null}
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
    </ContractorHoldMemoJobDetailsWrapper>
  );
};

export default HoldMemoJobDetails;
