import React from 'react';
import ProducerInvoiceCard from './components/ProducerInvoiceCard';
import { NoUnPaidInvoiceDiv } from './Invoices.style';
import FinanceIcon from '@iso/assets/images/finance-icon.svg';
import { Col, Row } from 'antd';

const NoRequestedInvoiceComponent = () => {
  return (
    <NoUnPaidInvoiceDiv>
      <img src={FinanceIcon} alt="BuddiIcon" />
      <h2>No Invoice</h2>
    </NoUnPaidInvoiceDiv>
  );
};

const RequestedInvoices = ({ loading, invoices, onOpen }) => {
  return !loading && invoices && invoices.length > 0 ? (
    <Row gutter={[35, 30]}>
      {invoices.map((invoice) => (
        <Col xs={24} md={12} xxl={8} key={invoice.id}>
          <ProducerInvoiceCard
            key={`unpaid-invoice-${invoice.id}`}
            invoice={invoice}
            onOpen={onOpen}
          />
        </Col>
      ))}
    </Row>
  ) : (
    !loading && (!invoices || (invoices && invoices.length === 0)) && (
      <NoRequestedInvoiceComponent />
    )
  );
};

export default RequestedInvoices;
