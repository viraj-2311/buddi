import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { generateInvitationList } from '@iso/lib/helpers/utility';
import notify from '@iso/lib/helpers/notify';
import _ from 'lodash';
import CorporateNetworkConnections from '../CorporateNetworkConnections/CorporateNetworkConnections';
import CorporateNetworkConnectionPageMenu from './CorporateNetworkConnectionPageMenu';
import CorporateNetworkInvitations from '../CorporateNetworkInvitations/CorporateNetworkInvitations';
import CorporateNetworkHeader from '../CorporateNetworkHeader/CorporateNetworkHeader';
import ConnectUser from '../../../Person/Network/ConnectUser/ConnectUser';
import ConnectMoreContact from '../../../Person/Network/ConnectUser/ConnectMoreContact';
import { inviteCompanyNetworkUserRequest } from '@iso/redux/companyNetwork/actions';

const CorporateNetwork = () => {
  const dispatch = useDispatch();
  const { companyId } = useSelector((state) => state.ProducerJob);
  const { loading, error, professionals } = useSelector(
    (state) => state.CompanyNetwork.invite
  );
  const [connectUser, setConnectUser] = useState(false);
  const [connectMoreUserContact, setConnectMoreUserContact] = useState(false);
  const { receivedInvitations } = useSelector((state) => state.CompanyNetwork);
  const [sendInvited, setSendInvited] = useState(false);

  const pendingInvitations = useMemo(() => {
    return receivedInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedInvitations]);
  const CORPORATE_NETWORK_MENUS = [
    {
      name: 'Connections',
      path: 'connections',
      pattern: '/companies/:companyId/network/connections',
      component: CorporateNetworkConnections,
    },
    {
      name: `Invitations (${pendingInvitations.length})`,
      path: 'invitations',
      pattern: '/companies/:companyId/network/invitations',
      component: CorporateNetworkInvitations,
    },
    // {
    //   name: 'Contacts',
    //   path: 'contacts',
    //   pattern: '/companies/:companyId/network/contacts',
    //   component: null,
    // },
  ];
  const { url } = useRouteMatch();
  const menuColor = '#51369a';

  const showPopupConnectUser = (flag) => {
    setConnectUser(flag);
  };

  const showPopupMoreConnectUser = (flag) => {
    showPopupConnectUser(false);
    setConnectMoreUserContact(flag);
  };

  const handleInvitePerson = (values, latestQuery) => {
    setSendInvited(true);
    const emailArr = generateInvitationList(values, latestQuery);
    let payloadObject = { professionals: emailArr };
    const payload = _.cloneDeep(payloadObject);
    dispatch(inviteCompanyNetworkUserRequest(companyId, payload));
  };

  useEffect(() => {
    if (!loading && professionals.length > 0 && sendInvited) {
      setSendInvited(false);
      showPopupMoreConnectUser(false);
      let sendSuccess = true;
      for (let i = 0; i < professionals.length; i++) {
        if (professionals[i].error) {
          sendSuccess = false;
          notify(
            'error',
            professionals[i].error + ': ' + professionals[i].email
          );
        }
      }
      if (sendSuccess) notify('success', 'Send invitation');
    } else if (!loading && error && sendInvited) {
      setSendInvited(false);
      showPopupMoreConnectUser(false);
      notify('error', 'Failed to send invitation');
    }
  }, [loading, error, professionals]);

  return (
    <>
      <CorporateNetworkHeader
        showPopupConnectUser={(flag) => showPopupConnectUser(flag)}
      />
      <CorporateNetworkConnectionPageMenu
        menus={CORPORATE_NETWORK_MENUS}
        color={menuColor}
      />
      <Switch>
        {CORPORATE_NETWORK_MENUS.map((menu, index) => (
          <Route
            path={`${url}/${menu.path}`}
            component={menu.component}
            key={`corporate-network-routes_${index}`}
          />
        ))}
        <Redirect to={`${url}/connections`} />
      </Switch>
      <ConnectUser
        visible={connectUser}
        handleCancel={() => {
          showPopupConnectUser(false);
        }}
        showPopupMoreConnect={() => {
          showPopupMoreConnectUser(true);
        }}
        handleInvitePerson={handleInvitePerson}
      />

      <ConnectMoreContact
        visible={connectMoreUserContact}
        handleCancel={() => {
          showPopupMoreConnectUser(false);
        }}
        handleInvitePerson={handleInvitePerson}
      />
    </>
  );
};

export default CorporateNetwork;
