import React from 'react';
import ContractorInvoiceCard from './components/InvoiceCard';
import { NoUnPaidInvoiceDiv } from './Invoices.style';
import FinanceIcon from '@iso/assets/images/finance-icon.svg';
import { Col, Row } from 'antd';

const NoUnPaidInvoiceComponent = () => {
  return (
    <NoUnPaidInvoiceDiv>
      <img src={FinanceIcon} alt='BuddiIcon' />
      <h2>You haven't sent any Invoices yet</h2>
    </NoUnPaidInvoiceDiv>
  );
};

const UnpaidInvoices = ({ loading, invoices, onOpen }) => {
  const filterInvoices = (invoices || []).filter((invoice) => invoice?.job?.wrapAndPayType !== 1);
  return !loading && filterInvoices && filterInvoices.length > 0 ? (
    <Row gutter={[35, 30]}>
      {filterInvoices.map((invoice) => (
        <Col
          xs={24}
          md={12}
          xxl={8}
          key={invoice.id}
          className='request-invoice'
        >
          <ContractorInvoiceCard
            key={`unpaid-invoice-${invoice.id}`}
            invoice={invoice}
            onOpen={onOpen}
          />
        </Col>
      ))}
    </Row>
  ) : (
    !loading && filterInvoices && filterInvoices.length === 0 && (
      <NoUnPaidInvoiceComponent />
    )
  );
};

export default UnpaidInvoices;
