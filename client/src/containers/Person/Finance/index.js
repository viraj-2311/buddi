import React from 'react';
import {Switch, Route, useRouteMatch, Redirect} from 'react-router-dom';
import ContractorInvoices from './routes/Invoices';
import ContractorInvoiceRoutes from './routes/Invoices/routes';

const FinanceRoutes = () => {
  let { url } = useRouteMatch();

  return (
    <div className="container mx-auto">
      <Switch>
        <Route exact path={`${url}/invoices`} component={ContractorInvoices} />
        <Route path={`${url}/invoices/:invoiceId`} component={ContractorInvoiceRoutes} />

        <Redirect to={`${url}/invoices`} />
      </Switch>
    </div>
  );
};

export default FinanceRoutes;
