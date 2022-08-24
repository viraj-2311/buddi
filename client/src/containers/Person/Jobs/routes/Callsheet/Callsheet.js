import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import { fetchUserCallsheetsRequest } from '@iso/redux/jobCallsheet/actions';
import LayoutWrapper from '@iso/components/utility/layoutWrapper.js';
import JobCallsheetItem from '../../components/CallsheetItem';
import EmptyComponent from '@iso/components/EmptyComponent';
import Box from '@iso/components/utility/box';
import Loader from '@iso/components/utility/loader';

const ContractorCallsheets = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const {callsheets, list: userCallsheetsRequest} = useSelector(state => state.JobCallsheet);

  useEffect(() => {
    dispatch(fetchUserCallsheetsRequest(authUser.id));
  }, [authUser]);

  const handleOpen = (jobCallsheet) => {
    history.push(`./callsheet/${jobCallsheet.id}`);
  };

  if (userCallsheetsRequest.loading) {
    return <Loader />;
  }

  return (
    <LayoutWrapper>
      <>
        {callsheets.length == 0
          ? (<EmptyComponent text="You have no Callsheets" />)
          : (callsheets.map((jobCallsheet, index) => (
              <Box key={index}>
                <JobCallsheetItem jobCallsheet={jobCallsheet} onOpen={handleOpen} />
              </Box>
            )
          ))
        }
      </>
    </LayoutWrapper>
  );
};

export default ContractorCallsheets;
