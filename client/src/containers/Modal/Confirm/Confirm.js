import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from './Confirm.style';
import Button from '@iso/components/uielements/button';
import ConfirmIcon from '@iso/components/icons/Confirm';
import { closeBookCrewConfirm, showSuccess } from '@iso/redux/modal/actions';

export default ({ onYes, onNo, description, ...rest }) => {
  const dispatch = useDispatch();
  const {
    confirm: { visible },
  } = useSelector((state) => state.Modal.bookCrew);
  const { loading, error } = useSelector((state) => state.ProducerJob.bookCrew);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (!loading && !error && action === 'book') {
      dispatch(closeBookCrewConfirm());
      dispatch(
        showSuccess({
          props: {
            description: description,
          },
        })
      );
    }

    if (!loading && action === 'book') {
      setAction('');
    }
  }, [loading]);

  const yesBook = (e) => {
    setAction('book');
    if (onYes) onYes();
  };

  const noBook = () => {
    dispatch(closeBookCrewConfirm());
    if (onNo) onNo();
  };

  const handleCancel = () => {
    dispatch(closeBookCrewConfirm());
  };
  return (
    <ConfirmModal
      visible={visible}
      width={600}
      closable={false}
      getContainer='#isoModalWrapper'
      onCancel={handleCancel}
      footer={null}
      maskStyle={{ position: 'absolute' }}
    >
      <p className='modal-icon-wrapper'>
        <ConfirmIcon width={62} height={62} fill='none' stroke='#eb5757' />
      </p>
      <h2 className='title'>Are you sure?</h2>
      <p className='description'>
        Do you really want to book this crew?
        <br />
        This action cannot be undone.
      </p>
      <div className='actions'>
        <Button className='default' loading={loading} onClick={yesBook}>
          Yes
        </Button>
        <Button className='red' onClick={noBook}>
          No
        </Button>
      </div>
    </ConfirmModal>
  );
};
