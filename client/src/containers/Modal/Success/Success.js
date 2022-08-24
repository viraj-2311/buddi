import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SuccessModal from './Success.style';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import SuccessIcon from '@iso/components/icons/Success';
import {
  closeSuccess
} from '@iso/redux/modal/actions';

export default ({}) => {
  const dispatch = useDispatch();
  const { success: { visible, props } } = useSelector(state => state.Modal);

  const handleCancel = () => {
    dispatch(closeSuccess());
    if (props.onCancel) props.onCancel()
  };

  return (
    <SuccessModal
      visible={visible}
      width={405}
      closable={false}
      wrapClassName="hCentered"
      footer={null}
    >
      <Button type="link" className="closeBtn" onClick={handleCancel}><MultiplyIcon width={14} height={14}/></Button>
      <p className="modal-icon-wrapper">
        {props.customIcon ? props.customIcon : <SuccessIcon width={50} height={50} />}
      </p>
      <h2 className="title">{props.title || 'Congratulations'}</h2>
      <p className="description">
        {props.description}
      </p>
      <div className="actions">
        <Button type="primary" shape="round" onClick={handleCancel}>Continue</Button>
      </div>
    </SuccessModal>
  );
}
