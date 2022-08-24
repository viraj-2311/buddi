import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import ContractorInvoicesWrapper, {
  FilterAction,
  InvoicePreviewModal,
} from './Invoices.style';
import Loader from '@iso/components/utility/loader';
import RadioSwitch from './components/Switch';
import Button from '@iso/components/uielements/button';
import { RadioButton } from '@iso/components/uielements/radio';
import Select, { SelectOption } from '@iso/components/uielements/select';
import FinanceReport from './Report';
import UnpaidInvoices from './UnpaidInvoices';
import PaidInvoices from './PaidInvoices';
import Spin from '@iso/components/uielements/spin';
import {
  fetchContractorInvoicesRequest,
  fetchContractorInvoiceDetailRequest,
  fetchContractorInvoiceDetailSuccess,
} from '@iso/redux/contractorInvoice/actions';

import {
  financeStatusFilterList,
  FinanceStatusFilterType,
} from '@iso/enums/invoice_producer_status';
import InvoiceTypes from '@iso/enums/invoice_types';
import CreateInvoice from './components/CreateInvoice/CreateInvoice';
import ContractorInvoicePreview from './components/InvoicePreview';

const Option = SelectOption;

const ContractorInvoices = () => {
  const invoiceStatusList = [
    { status: InvoiceTypes.UNPAID },
    { status: InvoiceTypes.PAID },
  ];
  const dispatch = useDispatch();
  const history = useHistory();
  const { invoices, list } = useSelector((state) => state.ContractorInvoice);
  const { user: authUser } = useSelector((state) => state.Auth);
  const [viewInvoice, setViewInvoice] = useState({});
  const {
    invoice,
    detail: { loading: invoiceDetailLoading, error: invoiceDetailError },
  } = useSelector((state) => state.ContractorInvoice);

  const [invoiceModal, setInvoiceModal] = useState({ visible: false });
  const [showLoader, setShowLoader] = useState(true);
  const [action, setAction] = useState('');
  const [invoiceStatusRadio, setInvoiceStatusRadio] = useState(
    InvoiceTypes.UNPAID
  );
  const [invoiceFilter, setInvoiceFilter] = useState(
    FinanceStatusFilterType.ALL
  );

  const bindContractorInvoices = (status) => {
    const filter = { status };
    dispatch(fetchContractorInvoicesRequest(authUser.id, filter));
  };

  useEffect(() => {
    dispatch(fetchContractorInvoiceDetailSuccess(null));
  }, [dispatch]);

  useEffect(() => {
    bindContractorInvoices(invoiceStatusRadio);
  }, [invoiceStatusRadio]);

  useEffect(() => {
    setViewInvoice({
      visible: !invoiceDetailLoading && !invoiceDetailError && !!invoice,
      invoice,
    });

    if (
      !invoiceDetailLoading &&
      !invoiceDetailError &&
      action === 'fetch_invoice_detail'
    ) {
      setShowLoader(false);
    }

    if (!invoiceDetailLoading && action === 'fetch_invoice_detail') {
      setAction('');
    }
  }, [invoice, invoiceDetailLoading, invoiceDetailError]);

  const handleOpen = (invoice) => {
    history.push(`./invoices/${invoice.id}/detail`);
  };

  const handleView = (invoice) => {
    setAction('fetch_invoice_detail');
    dispatch(fetchContractorInvoiceDetailRequest(authUser.id, invoice.id));
  };

  const handleCancel = () => {
    setViewInvoice({ visible: false, invoice: null });
    // setAction('fetch_invoice_detail');
    // dispatch(fetchContractorInvoiceDetailRequest(authUser.id, invoice.id));
  };

  const handleInvoiceModal = ({ type, isRefreshList = false }) => {
    if (type === 'close') {
      setInvoiceModal({ visible: false });
    }
    if (isRefreshList) {
      bindContractorInvoices(invoiceStatusRadio);
    }
  };

  const handleInvoiceStatusRadioChange = (status) => {
    setInvoiceFilter(FinanceStatusFilterType.ALL);
    setInvoiceStatusRadio(status);
  };

  const handleSelectFinanceReport = (selectedFilter) => {
    if (selectedFilter === FinanceStatusFilterType.PAID) {
      setInvoiceStatusRadio(InvoiceTypes.PAID);
      setInvoiceFilter(FinanceStatusFilterType.ALL);
    } else {
      setInvoiceStatusRadio(InvoiceTypes.UNPAID);
      setInvoiceFilter(selectedFilter);
    }
  };

  const filteredUnpaidInvoices = useMemo(() => {
    if (invoiceFilter === FinanceStatusFilterType.ALL) {
      return invoices;
    }
    return invoices;
    // return invoices.filter((invoice) => {
    //   return invoice.status === invoiceFilter;
    // });
  }, [invoices, invoiceFilter]);

  const paidInvoices = useMemo(() => {
    return invoices;
  }, [invoices]);

  return (
    <ContractorInvoicesWrapper>
      <h3 className='pageTitle'>Finance</h3>
      {/* <div className="financeReportWrapper">
        <FinanceReport onSelectFinanceReport={handleSelectFinanceReport} />
      </div> */}

      <div className='invoiceListWrapper'>
        <div className='actionWrapper'>
          <RadioSwitch value={invoiceStatusRadio}>
            {invoiceStatusList.map(({ status }) => (
              <RadioButton
                key={status}
                value={status}
                onClick={() => handleInvoiceStatusRadioChange(status)}
              >
                {status}
              </RadioButton>
            ))}
          </RadioSwitch>
          {invoiceStatusRadio === InvoiceTypes.UNPAID && (
            <FilterAction>
              {/* <Button
                className='createInvoice'
                type='primary'
                shape='round'
                onClick={() => setInvoiceModal({ visible: true })}
              >
                Create Invoice
              </Button> */}
              {/* <Select
                className="sortBy"
                placeholder="Sort"
                value={invoiceFilter}
                onChange={(value) => {
                  setInvoiceFilter(value);
                }}
              >
                {financeStatusFilterList.map(({ status }) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select> */}
            </FilterAction>
          )}
        </div>
        <div className='invoiceList'>
          <Spin spinning={list.loading}>
            {invoiceStatusRadio === InvoiceTypes.UNPAID ? (
              <UnpaidInvoices
                invoices={filteredUnpaidInvoices}
                // invoices={paidInvoices}
                onOpen={handleOpen}
                loading={list.loading}
              />
            ) : (
              <PaidInvoices invoices={paidInvoices} onView={handleView} />
            )}
          </Spin>
        </div>
        <CreateInvoice
          visible={invoiceModal.visible}
          setModalData={handleInvoiceModal}
        />
      </div>
      {viewInvoice.visible && (
        <InvoicePreviewModal
          visible
          width={950}
          wrapClassName='hCentered'
          onCancel={handleCancel}
          footer={null}
          closable={false}
        >
          <div className='invoicePreviewBody'>
            <ContractorInvoicePreview invoice={viewInvoice.invoice} />
          </div>
        </InvoicePreviewModal>
      )}
      {invoiceDetailLoading && !invoiceDetailError && <Loader />}
    </ContractorInvoicesWrapper>
  );
};

export default ContractorInvoices;
