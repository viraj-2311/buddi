import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import ReinstateJob from './ReinstateJob.style';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import { InfoCircleFilled } from '@ant-design/icons';
import JobReinstate from '@iso/containers/Company/Jobs/JobBoard/Job/JobReinstate/JobReinstate'
import JobReinstateMultiple from '../../containers/Company/Jobs/JobBoard/Job/JobReinstate/JobReinstateMultiple';
const initModalState = {
  visible: false, job: null, reinstate: null
}
export default ({
  visible,
  width,
  bodyStyle,
  title,
  description,
  onCancel,
  confirmLoading = false,
  job,
  wrapClassName = 'hCentered',
  isMultipleReinstate = false,
  jobs = [],
  onFinish = () => { }
}) => {
  const [jobModal, setJobModal] = useState(initModalState);
  const handleJobModal = (type) => {
    onFinish();
    if (type === "close") {
      setJobModal(initModalState);
      // dispatch(clearJobDetails());
    }
    else if (type == 'finish') {
      setJobModal(initModalState);
      onFinish();
    }
  };
  const handleReinstateType = (type) => {
    setJobModal({ visible: true, job: job, reinstate: type });

  }

  const handleClose = () => {
    setJobModal({
      ...initModalState,
      visible: false
    });
    onCancel();
  };
  const handleMultiClose = ()=>{
    setJobModal({
      ...initModalState,
      visible: false
    });
    onCancel();
  }
  if (!visible) return <></>
  return (
    <>
      <ReinstateJob
        visible={visible}
        closable={false}
        width={width || 400}
        bodyStyle={bodyStyle}
        wrapClassName={wrapClassName}
        footer={null}
      >
        <Button type='link' className='closeBtn' onClick={handleClose}>
          <MultiplyIcon width={14} height={14} />
        </Button>
        <p className='modal-icon-wrapper'>
          <InfoCircleFilled style={{ color: '#3b86ff' }} />
        </p>
        <h2 className='title'>{title}</h2>
        <p className='description'>{description}</p>
        <div className='actions'>
          <Button
            className='type-two holdingBtn'
            shape='round'
            style={{ marginBottom: 10 }}
            onClick={() => handleReinstateType('PENDING')}
          >
            Holding
          </Button>
          <Button
            className={cn('type-one activeBtn')}
            shape='round'
            onClick={() => handleReinstateType('ACTIVE')}
            loading={confirmLoading}
            autoFocus
          >
            Active
          </Button>
        </div>
        {
          isMultipleReinstate ?
            <JobReinstateMultiple
              visible={jobModal.visible}
              jobs={jobs}
              reinstate={jobModal.reinstate}
              onFinish={onFinish}
              onCancel={handleMultiClose}
            /> : <JobReinstate
              onClose={handleClose}
              visible={jobModal.visible}
              job={jobModal.job}
              reinstate={jobModal.reinstate}
              setModalData={handleJobModal}
            />
        }
      </ReinstateJob>
    </>
  );
};
