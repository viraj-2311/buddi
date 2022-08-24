import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams
} from 'react-router-dom';
import ContractorInvoiceDetail from './Detail';
import Loader from '@iso/components/utility/loader';
import { fetchContractorInvoiceDetailRequest } from '@iso/redux/contractorInvoice/actions';

const ContractorInvoiceRoutes = () => {
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { detail: { loading, error } } = useSelector(state => state.ContractorInvoice);
  const [loader, setLoader] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { invoiceId } = useParams();

  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchContractorInvoiceDetailRequest(authUser.id, invoiceId));
  }, [invoiceId]);

  useEffect(() => {
    if (!loading && isFetching) {
      setIsFetching(false);
      setLoader(false);
    }
  }, [loading, error]);

  if (loader) {
    return <Loader />;
  }

  return (
    <Switch>
      <Route exact path={`${url}/detail`} component={ContractorInvoiceDetail} />
      <Redirect to={`${url}/detail`} />
    </Switch>
  )
};

export default ContractorInvoiceRoutes;
