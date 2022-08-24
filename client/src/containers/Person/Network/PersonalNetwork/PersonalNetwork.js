import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { invitePersonalNetworkUserRequest } from '@iso/redux/personalNetwork/actions';
import notify from '@iso/lib/helpers/notify';
import PersonalNetworkHeader from '../PersonalNetworkHeader';
import PersonalNetworkInvitations from '../PersonalNetworkInvitations';
import PersonalNetworkConnections from '../PersonalNetworkConnections';
import PersonalNetworkContacts from '../PersonalNetworkContacts';
import PersonalConnectionPageMenu from './PersonalConnectionPageMenu';
import ConnectUser from '../ConnectUser';
import ConnectMoreContact from '../ConnectUser/ConnectMoreContact';
import { generateInvitationList } from '@iso/lib/helpers/utility';

const PersonalNetwork = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { loading, error, professionals } = useSelector(
    (state) => state.PersonalNetwork.invite
  );
  const [connectUser, setConnectUser] = useState(false);
  const [sendInvited, setSendInvited] = useState(false);
  const [connectMoreUserContact, setConnectMoreUserContact] = useState(false);

  const { receivedInvitations } = useSelector((state) => state.PersonalNetwork);

  const pendingInvitations = useMemo(() => {
    return receivedInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedInvitations]);

  const PERSONAL_NETWORK_MENUS = [
    {
      name: 'Connections',
      path: 'connections',
      pattern: '/network/connections',
      component: PersonalNetworkConnections,
    },
    {
      name: `Invitations (${pendingInvitations.length})`,
      path: 'invitations',
      pattern: '/network/invitations',
      component: PersonalNetworkInvitations,
    },
    // {
    //   name: 'Contacts',
    //   path: 'contacts',
    //   pattern: '/network/contacts',
    //   component: PersonalNetworkContacts,
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
    dispatch(invitePersonalNetworkUserRequest(authUser.id, payload));
  };

  useEffect(() => {
    if (!loading && professionals.length > 0 && sendInvited) {
      showPopupMoreConnectUser(false);
      setSendInvited(false);
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
      <PersonalNetworkHeader
        showPopupConnectUser={(flag) => showPopupConnectUser(flag)}
      />
      <PersonalConnectionPageMenu
        menus={PERSONAL_NETWORK_MENUS}
        color={menuColor}
      />
      <Switch>
        {PERSONAL_NETWORK_MENUS.map((menu, index) => (
          <Route
            path={`${url}/${menu.path}`}
            component={menu.component}
            key={`personal-network-routes_${index}`}
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

export default PersonalNetwork;
