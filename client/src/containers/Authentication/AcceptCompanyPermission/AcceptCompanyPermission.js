import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect, useHistory, useLocation} from 'react-router';
import AcceptCompanyPermissionStyleWrapper from './AcceptCompanyPermission.style';
import { acceptCompanyPermissionByOwnerRequest } from '@iso/redux/company/actions';
import { showServerError } from '@iso/lib/helpers/utility';

export default () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { error: acceptError } = useSelector(state => state.Company.accept);

  useEffect(() => {
    const { search } = location;

    if (search && search.includes('token')) {
      const queries = search.split('?token=');
      const token = queries[queries.length - 1];

      dispatch(acceptCompanyPermissionByOwnerRequest(token));
    }
  }, [location, dispatch]);

  return (
    <AcceptCompanyPermissionStyleWrapper>
      <div className="isoAcceptPermissionText">
        {acceptError && showServerError(acceptError)}
      </div>
    </AcceptCompanyPermissionStyleWrapper>
  );
};