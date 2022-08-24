import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect, useHistory, useLocation} from 'react-router';
import ViewMemoStyleWrapper from './ViewMemo.style';
import queryString from 'query-string';
import { verifyMemoRequest } from '@iso/redux/auth/actions';
import { showServerError } from '@iso/lib/helpers/utility';

export default () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { error: verificationError } = useSelector(state => state.Auth.memoVerification);

  useEffect(() => {
    const { search } = location;
    const params = queryString.parse(search);
    dispatch(verifyMemoRequest(params));
  }, [location, dispatch]);

  return (
    <ViewMemoStyleWrapper>
      <div className="isoViewMemoText">
        {verificationError && showServerError(verificationError)}
      </div>
    </ViewMemoStyleWrapper>
  );
};