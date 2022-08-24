import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router';
import Loader from '@iso/components/utility/loader';
import Button from '@iso/components/uielements/button';
import ErrorComponent from '@iso/components/ErrorComponent';
import SuccessText from '@iso/components/utility/successText';
import StatusTag from '@iso/components/utility/statusTag';
import CallsheetDetailWrapper from './Details.style'
import JobCallsheetItem from '../../../components/CallsheetItem';
import JobCallsheetDetail from '../../../components/CallsheetDetail';
import { fetchAccountCallsheetsRequest } from '@iso/redux/accountBoard/actions';
import { fetchCallsheetDetailRequest, acceptCallsheetRequest } from '@iso/redux/jobCallsheet/actions';

const ContractorCallsheetDetail = () => {
  const dispatch = useDispatch();
  const { callsheetId } = useParams();
  const { user: authUser } = useSelector(state => state.Auth);
  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    callsheet: jobCallsheet,
    detail: detailRequest,
    accept: acceptRequest
  } = useSelector(state => state.JobCallsheet);

  useEffect(() => {
    dispatch(fetchCallsheetDetailRequest(callsheetId));
  }, [callsheetId]);

  useEffect(() => {
    if (!acceptRequest.loading && !acceptRequest.error && loader) {
      setSuccessMsg('Callsheet accepted successfully');
      dispatch(fetchAccountCallsheetsRequest(authUser.id, {status: 'PENDING'}));
    }

    if (!acceptRequest.loading && loader) {
      setLoader(false);
    }
  }, [acceptRequest]);

  const acceptCallsheet = () => {
    setLoader(true);
    const payload = {};
    dispatch(acceptCallsheetRequest({callsheetId, payload}));
  };

  if (detailRequest.loading) {
    return (<Loader />);
  }

  return (
    <CallsheetDetailWrapper>
      <JobCallsheetItem jobCallsheet={jobCallsheet} />
      <div className="divider"></div>
      <JobCallsheetDetail jobCallsheet={jobCallsheet} />
      <div className="buttonWrapper">
        {jobCallsheet.accepted
          ? <StatusTag className="success callsheeetLabel">Confirmed</StatusTag>
          : (
            <>
              {!loader && acceptRequest.error && <ErrorComponent error={acceptRequest.error} />}
              {successMsg && <SuccessText text={successMsg} />}
              <Button type="primary" onClick={acceptCallsheet} loading={acceptRequest.loading}>Please Confirm</Button>
            </>
          )
        }
      </div>
    </CallsheetDetailWrapper>
  )
};

export default ContractorCallsheetDetail;