import React, { useEffect, useState } from 'react';
import StyledContractorInvoiceTable, { TableColumn } from './components/Table';
import { TotalInvoice, ActionDiv } from './Invoices.style';
import Button from '@iso/components/uielements/button';
import CurrencyText from '@iso/components/utility/currencyText';
import _ from 'lodash';
import { InvoiceStatus } from './components/InvoiceStatus';

const PaidInvoices = ({ invoices, onView }) => {
  const [tableRecords, setTableRecords] = useState([]);

  useEffect(() => {
    setTableRecords(
      invoices.map((invoice) => ({ ...invoice, key: invoice.id }))
    );
  }, [invoices]);

  const columnKey = {
    date: 'dates',
    invoice_amount: 'totalInvoiceAmount',
  };

  const columns = [
    {
      title: () => {
        return <TableColumn>Status</TableColumn>;
      },
      dataIndex: 'status',
      render: (status) => <InvoiceStatus status={status} />,
    },
    {
      title: () => {
        return <TableColumn>Client</TableColumn>;
      },
      dataIndex: ['job', 'client'],
      key: columnKey.job_client,
      render: (client) => client,
    },
    {
      title: <TableColumn>Gig Name</TableColumn>,
      dataIndex: ['job', 'title'],
      render: (title) => title,
    },
    {
      title: <TableColumn>Crew Paid</TableColumn>,
      dataIndex: 'crew_paid',
      render: (_) => '40/40',
    },
    {
      title: () => <TableColumn>Total</TableColumn>,
      key: columnKey.invoice_amount,
      render: (record) => (
        <TotalInvoice>
          <CurrencyText value={record.totalInvoiceAmount} />
        </TotalInvoice>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <ActionDiv>
          <Button type="link">View</Button>
          <Button type="link">Download</Button>
        </ActionDiv>
      ),
    },
  ];

  // console.log(tableRecords);

  return (
    <StyledContractorInvoiceTable
      columns={columns}
      scroll={{ x: 1024 }}
      dataSource={tableRecords}
      className="producersCompletedInvoice"
    />
  );
};

export default PaidInvoices;
