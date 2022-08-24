import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import StyledModal, { PayApprovedContentWrapper } from './PayApproved.style';
import InvoiceApprovedDepartment from './InvoiceApprovedDepartment';
import ConfirmModal from '@iso/components/Modals/ConfirmNew';
import {
  payApprovedInvoiceByBankRequest,
  payApprovedInvoiceByWalletRequest,
  fetchJobInvoiceMemosRequest
} from '@iso/redux/jobInvoice/actions';
import { formatCurrency } from '@iso/lib/helpers/utility';
import _ from 'lodash';
import PaymentSummaryModal from '../Components/PaymentSummaryModal';
import notify from '@iso/lib/helpers/notify';
import HowToPay from './HowToPay';
import { useHistory } from "react-router-dom";
import { getCompanyWallet } from '@iso/redux/company/actions';

const PayApproved = ({
  job,
  departments,
  memos,
  setModalData,
  onCancel,
  visiblePayApprovedModal,
  setVisiblePayApprovedModal
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { payApproved } = useSelector((state) => state.JobInvoice);
  const { companyId } = useSelector((state) => state.AccountBoard);
  const { plaidCompanyAccount, paidInvoices } = useSelector(
    (state) => state.Company
  );
  const [action, setAction] = useState('');

  const [visiblePayConfirm, setVisiblePayConfirm] = useState(false);
  const [visiblePaymentSummaryModal, setVisiblePaymentSummaryModal] = useState(false);
  const [howToPayModalVisible, setHowToPayModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');
  const [selectedPaymentBank, setSelectedPaymentBank] = useState(null);

  useEffect(() => {
    if (
      !payApproved.loading &&
      !payApproved.error &&
      action === 'pay_approved'
    ) {
      setTimeout(() => {
        dispatch(getCompanyWallet(companyId));
      }, 2000);
      setVisiblePayConfirm(false);
      dispatch(fetchJobInvoiceMemosRequest(job.id));
    }

    if (!payApproved.loading && action === 'pay_approved') {
      setAction('');
    }
  }, [payApproved]);

  useEffect(() => {
    if (!paidInvoices.loading && paidInvoices.error) {
      notify('error', 'Can not paid Invoices');
    }
  }, [paidInvoices]);

  const totalPayPrice = useMemo(() => {
    return memos.reduce((sum, memo) => sum + memo.invoice.totalPrice, 0);
  }, [memos]);

  const memosByPosition = useMemo(() => {
    return _.groupBy(memos, 'jobRole');
  }, [memos]);

  const handleCancel = () => {
    setModalData('close');
    onCancel();
  };

  const onPayClick = () => {
    setHowToPayModalVisible(true);
    setVisiblePayApprovedModal(false);
  };

  const handlePayCancel = () => {
    setVisiblePayConfirm(false);
  };

  const handlePayApproved = () => {
    setAction('pay_approved');
    let payload = {
      invoices: memos.map((iv) => iv?.invoice?.id)
    }
    if (selectedPaymentMethod === 'bank') {
      dispatch(payApprovedInvoiceByBankRequest(job.id, { ...payload, account_id: selectedPaymentBank.id }));
    } else if (selectedPaymentMethod === 'wallet') {
      dispatch(payApprovedInvoiceByWalletRequest(job.id, payload));
    }
  };

  const handleConfirm = () => {
    handlePayApproved();
    setVisiblePaymentSummaryModal(false);
    setVisiblePayConfirm(false);
  };

  const handleHowToPayModal = (action) => {
    if (action === 'close') {
      setHowToPayModalVisible(false);
      selectPaymentMethod('wallet');
    } else if (action === 'success') {
      setHowToPayModalVisible(false);
      setVisiblePaymentSummaryModal(true);
    }
  };

  const selectPaymentMethod = (paymentMethod) => {
    if (paymentMethod === 'bank') {
      if (
          !(plaidCompanyAccount.account && plaidCompanyAccount.account[0] && plaidCompanyAccount.account[0].accountName)
      ) {
        notify('error', 'Please login to your bank account to pay for the invoices');
        return;
      }

      // Set the first bank id as default payment bank id
      setSelectedPaymentBank(plaidCompanyAccount.account[0])
    }

    setSelectedPaymentMethod(paymentMethod)
  };

  const setupBuddiWallet = () => {
    history.push(`/companies/${companyId}/wallet`);
  }

  const ModalHeader = () => {
    return (
      <>
        <h3 className='title'>Pay All Approved</h3>
        <div className='invoiceTotals'>
          <div className='totalCrew'>
            <label>Total Talent:</label>
            <Input value={`${memos.length} / ${memos.length}`} />
          </div>
          <div className='totalAmount'>
            <label>Total Amount:</label>
            <Input value={formatCurrency('$', totalPayPrice)} />
          </div>
        </div>
      </>
    );
  };

  const ModalFooter = () => {
    return (
      <>
        <Button shape='round' className='cancelBtn' onClick={handleCancel}>
          Cancel
        </Button>
        <div className='button-approval'>
          <Button
            shape='round'
            className='payApprovedBtn'
            onClick={onPayClick}
            loading={payApproved.loading}
          >
            Select payment Method
          </Button>
        </div>
      </>
    );
  };
  
  return (
    <>
      <StyledModal
        visible={visiblePayApprovedModal}
        maskClosable={false}
        title={<ModalHeader />}
        onCancel={handleCancel}
        footer={<ModalFooter />}
      >
        <PayApprovedContentWrapper>
          <div className='payDepartmentList'>
            {departments.map((department, index) => (
              <InvoiceApprovedDepartment
                key={`approved-invoice-department-${department.id}`}
                job={job}
                department={department}
                memos={memosByPosition}
                opened={true}
              />
            ))}
          </div>
        </PayApprovedContentWrapper>
      </StyledModal>
      <ConfirmModal
        key='pay-approved-invoice-confirm'
        visible={visiblePayConfirm}
        maskClosable={false}
        container={false}
        title='Confirm Payment'
        description={
          <>
            Are you sure you want to pay the total amount of{' '}
            {<strong>{formatCurrency('$', totalPayPrice)}</strong>} to{' '}
            {<strong>{memos.length}</strong>} approved 
            {job.wrapAndPayType !== 1 ? ' invoice(s)?' : ' memo(s)?'}
          </> 
        }
        confirmLoading={payApproved.loading}
        onYes={handleConfirm}
        onNo={handlePayCancel}
      />
      {howToPayModalVisible && (
        <HowToPay
          handleHowToPayModal={handleHowToPayModal}
          selectedPaymentMethod={selectedPaymentMethod}
          selectPaymentMethod={selectPaymentMethod}
        />
      )}
      <PaymentSummaryModal
        paymentAmount={totalPayPrice}
        container={false}
        selectedPaymentMethod={selectedPaymentMethod}
        switchPaymentMethodToBank={() => { selectPaymentMethod('bank') }}
        key='payment-summary'
        visible={visiblePaymentSummaryModal}
        title='Payment'
        onDebit={() => {
          setVisiblePayConfirm(true);
        }}
        onCancel={() => {
          setVisiblePaymentSummaryModal(false);
        }}
        selectedPaymentBank={selectedPaymentBank}
        setSelectedPaymentBank={setSelectedPaymentBank}
      />
    </>
  );
};

export default PayApproved;
