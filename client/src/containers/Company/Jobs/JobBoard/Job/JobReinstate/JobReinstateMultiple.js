import React, { useState, useEffect } from 'react'
import MultiplyIcon from "@iso/components/icons/Multiply";
import Modal from '@iso/components/Modal';
import Button from "@iso/components/uielements/button";
import JobReinstateMultipleModal from './JobReinstateMultipleModal.style'
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';
import { useDispatch, useSelector } from 'react-redux';
import { reinstateJobDetailsRequest } from '../../../../../../redux/producerJob/actions';
const TITLE_MAP = {
    ACTIVE: 'Active',
    HOLDING: 'Holding'
}
function JobReinstateMultiple({ visible, onCancel = () => { }, onFinish = () => { }, jobs = [], reinstate }) {
    const dispatch = useDispatch();
    const { reinstate: reinstateReq ,companyId} = useSelector(state => state.ProducerJob)
    const [action, setAction] = useState('')
    const onConfirm = () => {
        let payload = {
            jobs: [...jobs],
            reinstate
        };
        if (companyId) {
            setAction('job_reinstate');            
            dispatch(reinstateJobDetailsRequest(companyId, payload));
        }
    }
    useEffect(() => {
        if (!reinstateReq.loading && !reinstateReq.error && action === 'job_reinstate') {
            notify('success', 'Job Reinstate successfully');
            onFinish();
        }

        if (reinstateReq.error && action === 'job_reinstate') {
            notify('error', showServerError(reinstateReq.error));
            onCancel();
        }

        if (!reinstateReq.loading && action === 'job_reinstate') {
            setAction('');
        }
    }, [reinstateReq]);

    return (
        <JobReinstateMultipleModal
            visible={visible}
            width={410}
            footer={null}
            closable={false}
            wrapClassName={'noHeaderModal'}
        >
            <div className="modal-header">
                <Button type="link" className="closeBtn" onClick={onCancel}>
                    <MultiplyIcon width={14} height={14} />
                </Button>
            </div>
            <div className="modal-content">
                <div className="heading">
                    <h2 className="title">Move to {TITLE_MAP[reinstate]} state</h2>
                    <p className="desc">Are you sure you want to move {jobs.length} job{jobs.length > 1 ? 's' : ''} to {TITLE_MAP[reinstate]} state ?</p>
                </div>
            </div>
            <div className="modal-footer">
                <div className="actions-btn">
                    <Button className="cancelBtn" shape="round" onClick={onCancel}>
                        No
                    </Button>
                    <Button className="continueBtn" shape="round" onClick={onConfirm} loading={reinstateReq.loading && action === 'job_reinstate'}>
                        Yes
                    </Button>
                </div>
            </div>
        </JobReinstateMultipleModal>
    )
}

export default JobReinstateMultiple
