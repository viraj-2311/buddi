import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router';
import { Layout } from 'antd';
import useWindowSize from '@iso/lib/hooks/useWindowSize';
import appActions from '@iso/redux/app/actions';
import InvoiceTypes from '@iso/enums/invoice_types';
import ProducerDashboard from './Producer';
import ContractorDashboard from './Contractor';
import EmptyComponent from '@iso/components/EmptyComponent';
import { isContractor, isExecutiveUser } from '@iso/lib/helpers/auth';
import {
  DashboardContainer,
  DashboardGlobalStyles,
  PopupOverIntro,
} from './Dashboard.styles';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';
import {
  fetchAccountJobsRequest,
  fetchAccountCallsheetsRequest,
} from '@iso/redux/accountBoard/actions';
import { signout } from '@iso/redux/auth/actions';
import { fetchPersonalNetworkReceivedInvitationRequest } from '@iso/redux/personalNetwork/actions';
import { fetchCompanyNetworkReceivedInvitationRequest } from '@iso/redux/companyNetwork/actions';
import { fetchContractorInvoicesRequest } from '@iso/redux/contractorInvoice/actions';
const { toggleAll } = appActions;

const styles = {
  layout: { flexDirection: 'row', overflowX: 'hidden' },
  content: {
    padding: 0,
    flexShrink: '0',
    // background: 'white',
    background: '#f5f7fa',
    position: 'relative',
  },
  footer: {
    background: '#ffffff',
    textAlign: 'center',
    borderTop: '1px solid #ededed',
  },
};

const AuthUserDashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { user: authUser, syncUser } = useSelector((state) => state.Auth);
  const appHeight = useSelector((state) => state.App.height);
  const { companyId } = useSelector((state) => state.ProducerJob);

  useEffect(() => {
    if (authUser.lastLogin) {
      dispatch(syncAuthUserRequest());
    }
  }, [dispatch]);

  useEffect(() => {
    if (
      !syncUser.loading &&
      syncUser.error &&
      syncUser.error === 'user_not_found'
    ) {
      dispatch(signout());
    }
  }, [syncUser]);

  useEffect(() => {
    // Subscribe Person/Pending, Callsheet, Network, Finance
    dispatch(fetchAccountJobsRequest(authUser.id, 'PENDING'));
    dispatch(fetchAccountCallsheetsRequest(authUser.id, { status: 'PENDING' }));
    dispatch(
      fetchPersonalNetworkReceivedInvitationRequest(authUser.id, {
        status: 'Pending',
      })
    );
    dispatch(
      fetchContractorInvoicesRequest(authUser.id, {
        status: InvoiceTypes.UNPAID,
      })
    );
  }, [location]);

  useEffect(() => {
    if (companyId) {
      dispatch(
        fetchCompanyNetworkReceivedInvitationRequest(companyId, {
          status: 'Pending',
        })
      );
    }
  }, [location, companyId]);

  if (!authUser.profileCompleted) {
    return <Redirect to='/account-wizard' />;
  }

  if (isExecutiveUser(authUser)) {
    return (
      <ProducerDashboard
        height={appHeight}
        styles={styles}
        className='producerLayout'
      />
    );
  } else if (isContractor(authUser)) {
    return (
      <ContractorDashboard
        height={appHeight}
        styles={styles}
        className='contractorLayout'
      />
    );
  }

  // if (isContractor(authUser)) {
  //   return (
  //     <ContractorDashboard
  //       height={appHeight}
  //       styles={styles}
  //       className='contractorLayout'
  //     />
  //   );
  // }
  
  return <EmptyComponent text='No pages matches with account type' />;
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { width, height } = useWindowSize();
  const { displayRegisterBuddiWallet } = useSelector((state) => state.Auth);
  const { userStepIntro, companyStepIntro } = useSelector(
    (state) => state.UserIntro
  );
  useEffect(() => {
    dispatch(toggleAll(width, height));
  }, [width, height, dispatch]);

  return (
    <DashboardContainer>
      {width >= 768 &&
        (userStepIntro.currentStepIntro >= 0 ||
          companyStepIntro.currentCompanyStepIntro >= 0) && (
          <PopupOverIntro></PopupOverIntro>
        )}
      <DashboardGlobalStyles />
      <Layout style={{ height: height }}>
        <AuthUserDashboard />
      </Layout>
    </DashboardContainer>
  );
}
