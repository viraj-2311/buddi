import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContractorJobMemoWrapper, {
  MessageDiv,
  W9AttachmentDiv,
} from './JobMemo.style';
// import ConfirmModal from '@iso/components/Modals/Confirm';
import filesize from 'filesize.js';
// import notify from '@iso/lib/helpers/notify';
// import { uploadFile } from '@iso/lib/helpers/s3';
// import MultiplyIcon from '@iso/components/icons/Multiply';
// import { showServerError, getW9AttachmentName } from '@iso/lib/helpers/utility';
import { InfoCircleFilled, PaperClipOutlined } from '@ant-design/icons';
import JobsIcon from '@iso/components/icons/Jobs';
// import Button from '@iso/components/uielements/button';
import UserGroupIcon from '@iso/components/icons/UserGroup';
import UserIcon from '@iso/components/icons/User';
import Icon from '@iso/components/icons/Icon';
import CalendarIcon from '@iso/components/icons/Calendar';
import LocationIcon from '@iso/components/icons/Location';
import PdfImg from '@iso/assets/images/pdf.svg';
import NoteIcon from '@iso/components/icons/Note';
import ContractorJobStatusColor from '@iso/enums/contractor_job_status_color';
import ContractorJobStatus from '@iso/enums/contractor_job_status';
// import {
//   updateContractorW9DocumentRequest,
//   removeContractorW9DocumentRequest,
// } from '@iso/redux/user/actions';

const ContractorJobMemo = ({ job }) => {
  const [w9Document, setW9Document] = useState(null);
  // const filePicker = useRef(null);
  const { user: authUser } = useSelector((state) => state.Auth);
  // const { updateW9Document, removeW9Document } = useSelector(
  //   (state) => state.User
  // );
  // const dispatch = useDispatch();
  // const [action, setAction] = useState('');
  // const [visibleRemoveW9Confirm, setVisibleRemoveW9Confirm] = useState(false);

  const status = useMemo(() => {
    if (job.accepted) {
      return ContractorJobStatus.ACTIVE;
      // return ContractorJobStatus.DEAL
    } else if (job.decline) {
      return ContractorJobStatus.DECLINED;
    } else if (job.completed) {
      return ContractorJobStatus.COMPLETED;
    } else {
      return job.memoType;
    }
  }, [job]);

  useEffect(() => {
    setW9Document(authUser.w9Document);
  }, [authUser]);

  // useEffect(() => {
  //   if (
  //     !updateW9Document.loading &&
  //     !updateW9Document.error &&
  //     action === 'update_w9_document'
  //   ) {
  //     notify('success', updateW9Document.success);
  //   }

  //   if (updateW9Document.error && action === 'update_w9_document') {
  //     notify('error', showServerError(updateW9Document.error));
  //   }

  //   if (!updateW9Document.loading && action === 'update_w9_document') {
  //     setAction('');
  //   }
  // }, [updateW9Document]);

  // useEffect(() => {
  //   if (
  //     !removeW9Document.loading &&
  //     !removeW9Document.error &&
  //     action === 'delete_w9_document'
  //   ) {
  //     setVisibleRemoveW9Confirm(false);
  //     notify('success', removeW9Document.success);
  //   }

  //   if (removeW9Document.error && action === 'delete_w9_document') {
  //     notify('error', showServerError(removeW9Document.error));
  //   }

  //   if (!removeW9Document.loading && action === 'delete_w9_document') {
  //     setAction('');
  //   }
  // }, [removeW9Document]);

  // const openFilePicker = () => {
  //   filePicker.current.click();
  // };
  // const onAttachmentLoad = async (attachments) => {
  //   // setInnerAttachments([...innerAttachments, ...Array.from(attachments)]);
  //   const file = attachments[0];
  //   const W9documentDirName =
  //     process.env.REACT_APP_S3_BUCKET_CONTRACTOR_W9_DOCUMENT;
  //   setAction('update_w9_document');
  //   const document = await uploadFile(file, W9documentDirName);
  //   if (document.location) {
  //     const attachment = {
  //       name: getW9AttachmentName(authUser, file),
  //       size: file.size,
  //       type: file.type,
  //       path: document.location,
  //     };
  //     const payload = { ...attachment, purpose: 'w9' };
  //     dispatch(updateContractorW9DocumentRequest(authUser.id, payload));
  //   }
  // };

  // const handleRemoveW9Cancel = () => {
  //   setVisibleRemoveW9Confirm(false);
  // };

  // const handleRemoveW9Confirm = () => {
  //   setAction('delete_w9_document');
  //   dispatch(removeContractorW9DocumentRequest(authUser.id, w9Document.id));
  // };

  return (
    <>
      <ContractorJobMemoWrapper>
        <div className='memoInfos'>
          <div className='infoLabel'>
            <JobsIcon
              width={20}
              height={18}
              fill={ContractorJobStatusColor[status]}
            />
            <span>Gig For:</span>
          </div>
          <div className='infoDetails'>{job.fullName}</div>
        </div>
        <div className='memoInfos'>
          <div className='infoLabel'>
            <UserGroupIcon
              width={20}
              height={16}
              fill={ContractorJobStatusColor[status]}
            />
            <span>Department:</span>
          </div>
          <div className='infoDetails'>{job.jobRoleGroup}</div>
        </div>
        <div className='memoInfos'>
          <div className='infoLabel'>
            <UserIcon
              width={20}
              height={16}
              fill={ContractorJobStatusColor[status]}
            />
            <span>Position:</span>
          </div>
          <div className='infoDetails'>{job.jobRole}</div>
        </div>
        <div className='memoInfos'>
          <div className='infoLabel'>
            <CalendarIcon
              width={20}
              height={20}
              fill={ContractorJobStatusColor[status]}
            />
            <span>Dates:</span>
          </div>
          <div className='infoDetails'>{job.dates}</div>
        </div>
        <div className='memoInfos'>
          <div className='infoLabel'>
            <LocationIcon
              width={20}
              height={20}
              fill={ContractorJobStatusColor[status]}
            />
            <span>Show Location - City:</span>
          </div>
          <div className='infoDetails'>
            {job.city}, {job.state}
          </div>
        </div>
        <div className='memoInfos'>
          <div className='infoLabel'>
            <NoteIcon
              width={18}
              height={20}
              fill={ContractorJobStatusColor[status]}
            />
            <span>Notes:</span>
          </div>
          <div className='infoDetails'>
          <div className="editor-preview-container" dangerouslySetInnerHTML={{ __html: job.headline }} />
          </div>
        </div>
      </ContractorJobMemoWrapper>
      {job.memoType === 'DEAL' && (
        <MessageDiv color={w9Document ? '#f5dbc4' : '#fceeee'}>
          <p className='modal-icon-wrapper'>
            <InfoCircleFilled
              style={{ color: w9Document ? '#f48d3a' : '#e25656' }}
            />
          </p>
          {w9Document && (
            <p>
              We are sharing your W9 document. The talent needs your W9 to be on file before you get paid, if you have an updated W9 please re-upload the file.
            </p>
          )}
          {!w9Document && (
            <p>
             You haven't uploaded your W9 document yet. The talent needs your W9 
             to be on file before you get paid, upload it now to avoid any delays in payment.
            </p>
          )}
        </MessageDiv>
      )}
      {job.memoType === 'DEAL' && (
        <W9AttachmentDiv>
          {/* <Button
            shape='round'
            type='secondary'
            icon={<PaperClipOutlined />}
            onClick={openFilePicker}
            loading={
              action === 'update_w9_document' || updateW9Document.loading
            }
          >
            <input
              ref={filePicker}
              type='file'
              onChange={(e) => onAttachmentLoad(e.target.files)}
              multiple
            />
            Update W9
          </Button> */}
          {w9Document && (
            <div className='attachmentItemList'>
              <div className='attachmentItem'>
                <div className='attachmentBox'>
                  <div className='attachmentDetails'>
                    <Icon image={PdfImg} width={16} height={20} />
                    <div className='rightDetail'>
                      <a
                        href={w9Document.path}
                        target='_blank'
                        title={w9Document.name}
                      >
                        {w9Document.name}
                      </a>
                      <span>({filesize(w9Document.size)})</span>
                    </div>
                  </div>
                  {/* <Button
                    type='link'
                    onClick={() => {
                      setVisibleRemoveW9Confirm(true);
                    }}
                  >
                    <MultiplyIcon width={14} height={14} />
                  </Button> */}
                </div>
              </div>
            </div>
          )}
        </W9AttachmentDiv>
      )}
      {/* <ConfirmModal
        key='remove-w9-confirm'
        visible={visibleRemoveW9Confirm}
        container={false}
        title='Confirm Remove W9'
        description={<>Are you sure you want to remove W9 Document?</>}
        confirmLoading={removeW9Document.loading}
        onYes={handleRemoveW9Confirm}
        onNo={handleRemoveW9Cancel}
      /> */}
    </>
  );
};

export default ContractorJobMemo;
