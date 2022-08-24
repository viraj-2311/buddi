import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import ContractorInvoicesWrapper, { FilterAction } from './Invoices.style';
import RadioSwitch from './components/Switch';
import Button from '@iso/components/uielements/button';
import { RadioButton } from '@iso/components/uielements/radio';
import Select, { SelectOption } from '@iso/components/uielements/select';
import FinanceReport from './Report';
import RequestedInvoices from './RequestedInvoices';
import CompletedInvoices from './CompletedInvoices';
import Spin from '@iso/components/uielements/spin';
import { fetchContractorInvoicesRequest } from '@iso/redux/contractorInvoice/actions';
import {
  financeStatusFilterList,
  FinanceStatusFilterType,
} from '@iso/enums/invoice_producer_status';
import InvoiceTypes from '@iso/enums/invoice_types';

const Option = SelectOption;

const ContractorInvoices = () => {
  const invoiceStatusList = [
    { status: InvoiceTypes.REQUESTED },
    { status: InvoiceTypes.COMPLETED },
  ];
  const dispatch = useDispatch();
  const history = useHistory();

  const { invoices, list } = useSelector((state) => state.ContractorInvoice);
  const { user: authUser } = useSelector((state) => state.Auth);
  const [invoiceStatusRadio, setInvoiceStatusRadio] = useState(
    InvoiceTypes.REQUESTED
  );
  const [invoiceFilter, setInvoiceFilter] = useState(
    FinanceStatusFilterType.ALL
  );

  useEffect(() => {
    const filter = { status: invoiceStatusRadio };
    dispatch(fetchContractorInvoicesRequest(authUser.id, filter));
  }, [invoiceStatusRadio]);

  const handleOpen = (invoice) => {
    history.push(`./invoices/${invoice.id}/detail`);
  };

  const handleInvoiceStatusRadioChange = (status) => {
    setInvoiceFilter(FinanceStatusFilterType.ALL);
    setInvoiceStatusRadio(status);
  };

  const handleSelectFinanceReport = (selectedFilter) => {
    if (selectedFilter === FinanceStatusFilterType.PAID) {
      setInvoiceStatusRadio(InvoiceTypes.COMPLETED);
      setInvoiceFilter(FinanceStatusFilterType.ALL);
    } else {
      setInvoiceStatusRadio(InvoiceTypes.REQUESTED);
      setInvoiceFilter(selectedFilter);
    }
  };

  const filteredRequestedInvoices = useMemo(() => {
    if (invoiceFilter === FinanceStatusFilterType.ALL) {
      return invoices;
    }
    return invoices;
    // return invoices.filter((invoice) => {
    //   return invoice.status === invoiceFilter;
    // });
  }, [invoices, invoiceFilter]);

  const completedInvoices = useMemo(() => {
    // const invoices1 = [];
    // [
    //   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 0,
    // ].forEach((e) => {
    //   if (invoices[0]) {
    //     invoices1.push({ ...invoices[0], id: e });
    //   }
    // });
    return invoices;
  }, [invoices]);

  return (
    <ContractorInvoicesWrapper>
      {/* <h3 className="pageTitle">Finance</h3>
      <div className="financeReportWrapper">
        <FinanceReport onSelectFinanceReport={handleSelectFinanceReport} />
      </div> */}

      <div className="invoiceListWrapper">
        <div className="actionWrapper">
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
          {/* {invoiceStatusRadio === InvoiceTypes.REQUESTED && (
            <FilterAction>
              <Select
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
              </Select>
            </FilterAction>
          )} */}
        </div>
        <div className="invoiceList">
          <Spin spinning={list.loading}>
            {invoiceStatusRadio === InvoiceTypes.REQUESTED ? (
              <RequestedInvoices
                invoices={filteredRequestedInvoices}
                // invoices={completedInvoices}
                onOpen={handleOpen}
                loading={list.loading}
              />
            ) : (
              <CompletedInvoices
                invoices={completedInvoices}
                onView={handleOpen}
              />
            )}
          </Spin>
        </div>
      </div>
    </ContractorInvoicesWrapper>
  );
};

export default ContractorInvoices;
