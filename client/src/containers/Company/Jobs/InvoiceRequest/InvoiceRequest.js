import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Button from '@iso/components/uielements/button';
import Input from '@iso/components/uielements/input';
import SuccessModal from '@iso/components/Modals/Success';
import StyledModal, {
  InvoiceRequestContentWrapper,
} from './InvoiceRequest.style';
import InvoiceDepartment from './InvoiceDepartment';
import MultiplyIcon from '@iso/components/icons/Multiply';
import notification from '@iso/components/Notification';
import Loader from '@iso/components/utility/loader';
import {
  fetchJobDealMemosRequest,
  sendJobInvoiceRequest,
} from '@iso/redux/jobInvoice/actions';
import { formatCurrency } from '@iso/lib/helpers/utility';
import { InfoCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment';

const InvoiceRequest = ({ job, setModalData }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { jobDepartments, jobMemos, fetchDealMemos, sendInvoice } = useSelector(
    (state) => state.JobInvoice
  );
  const [showLoader, setShowLoader] = useState(true);
  const [action, setAction] = useState('');
  const [billingPositions, setBillingPositions] = useState([]);
  const [successWrap, setSuccessWrap] = useState(false);

  useEffect(() => {
    setAction('fetch_deal_memos');
    dispatch(fetchJobDealMemosRequest(job.id));
  }, [job]);

  useEffect(() => {
    if (!fetchDealMemos.loading && action === 'fetch_deal_memos') {
      setShowLoader(false);
      setAction('');
    }
  }, [fetchDealMemos]);

  useEffect(() => {
    if (
      !sendInvoice.loading &&
      !sendInvoice.error &&
      action === 'send_invoice'
    ) {
      setSuccessWrap(true);
    }

    if (!sendInvoice.loading && action === 'send_invoice') {
      setAction('');
    }
  }, [sendInvoice]);

  const allPositions = useMemo(() => {
    let all = [];
    jobDepartments.map((department) => {
      const ids = department.jobRoles.map((jr) => jr.id);
      all = [...all, ...ids];
    });

    return _.uniq(all);
  }, [jobDepartments]);

  const jobMemosByPosition = useMemo(() => {
    return _.groupBy(jobMemos, 'jobRole');
  }, [jobMemos]);

  const totalInvoicePrice = useMemo(() => {
    return billingPositions.reduce((sum, p) => {
      const jobMemo = jobMemosByPosition[p];
      if (jobMemo && jobMemo.length) {
        return sum + jobMemo[0].invoiceMemo.totalPrice;
      }
      return sum;
    }, 0);
  }, [billingPositions, jobMemosByPosition]);

  useEffect(() => {
    setBillingPositions(allPositions);
  }, [allPositions]);

  const handleCancel = () => {
    setModalData('close');
  };

  const onBillingPositionSelect = (positions) => {
    setBillingPositions(positions);
  };

  const handleInvoiceRequest = () => {
    if (!billingPositions.length) {
      notification('error', 'No position selected');
      return;
    }
    setAction('send_invoice');
    const payload = { jobRoles: billingPositions, currentDate: moment().format('YYYY-MM-DD') };
    dispatch(sendJobInvoiceRequest(job.id, payload));
  };

  const onWrapSuccess = () => {
    setSuccessWrap(false);
    setModalData('success', job);
  };

  if (showLoader) {
    return <Loader />;
  }

  const InvoiceHeader = () => {
    return (
      <>
        <h3 className="title">Request Invoices</h3>
        <div className="invoiceTotals">
          <div className="totalCrew">
            <label>Total Talents:</label>
            <Input value={`${billingPositions.length} / ${jobMemos.length}`} />
          </div>
          <div className="totalAmount">
            <label>Total Amount:</label>
            <Input value={formatCurrency('$', totalInvoicePrice)} />
          </div>
        </div>
      </>
    );
  };

  const InvoiceFooter = () => {
    return (
      <>
        <Button shape="round" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          shape="round"
          type="primary"
          onClick={handleInvoiceRequest}
          loading={sendInvoice.loading}
        >
          Confirm & Request Invoices
        </Button>
      </>
    );
  };

  return (
    <StyledModal
      visible={true}
      title={<InvoiceHeader />}
      closeIcon={<MultiplyIcon width={14} height={14} />}
      onCancel={handleCancel}
      wrapClassName={"requestInvoiceModal"}
      footer={<InvoiceFooter />}
    >
      <InvoiceRequestContentWrapper>
        <SuccessModal
          visible={successWrap}
          description={
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>
              Request Invoice Sent.
              <br />
              Gig Moved to Wrap/Pay.
            </div>
          }
          customIcon={
            <InfoCircleFilled style={{ color: '#19913d', fontSize: 50 }} />
          }
          onClose={onWrapSuccess}
        />

        <div className="invoiceDepartmentList">
          {jobDepartments.map((department) => (
            <InvoiceDepartment
              key={`deal-memo-department-${department.id}`}
              job={job}
              department={department}
              memos={jobMemosByPosition}
              selectedPositions={billingPositions}
              onSelect={onBillingPositionSelect}
              opened={true}
            />
          ))}
        </div>
      </InvoiceRequestContentWrapper>
    </StyledModal>
  );
};

export default InvoiceRequest;
