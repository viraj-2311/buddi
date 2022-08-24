import React, { useState } from 'react';
import ReadOnlyModalWrapper from './ReadOnlyModal.style';
import { InfoCircleFilled } from '@ant-design/icons';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';

export default ({visible=false, setVisible=()=>{},onReinstate=()=>{}}) => {

    const onCancel = () => {
        setVisible(false);
    };
    

    const ModalHeader = () => {
        return (
           <>
               <p className={'modal-icon'}>
                   <InfoCircleFilled style={{ color: '#ffa177' }} />
               </p>
               <h3 className="title">Read Only</h3>
           </>
        )
    };

    return (
        <ReadOnlyModalWrapper
            onCancel={onCancel}
            visible={visible}
            maskClosable={false}
            footer={null}
            width={406}
            title={<ModalHeader />}
            closeIcon={<MultiplyIcon width={14} height={14} />}
        >
            <div className='inner-content'>
                <div className='note'>
                    Sorry, you can only Read or View an Archived Gig.
                </div>
            </div>
        </ReadOnlyModalWrapper>
    )
}