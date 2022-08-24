import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect, useHistory, useLocation} from 'react-router';
import DeclineCompanyPermissionStyleWrapper from './DeclineCompanyPermission.style';
import { declineCompanyPermissionByOwnerRequest } from '@iso/redux/company/actions';
import { showServerError } from '@iso/lib/helpers/utility';

export default () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { error: declineError } = useSelector(state => state.Company.decline);

  useEffect(() => {
    const { search } = location;

    if (search && search.includes('token')) {
      const queries = search.split('?token=');
      const token = queries[queries.length - 1];

      dispatch(declineCompanyPermissionByOwnerRequest(token, history));
    }
  }, [location, dispatch]);

  return (
    <DeclineCompanyPermissionStyleWrapper>
      <h2>
        {declineError && showServerError(declineError)}
      </h2>
    </DeclineCompanyPermissionStyleWrapper>
  );
};