import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import notify from '@iso/lib/helpers/notify';
import Scrollbar from '@iso/components/utility/customScrollBar';
import BuddiIcon from '@iso/assets/images/benji-icon-01.png';
import BuddiMonitor from '@iso/assets/images/buddi-contacts.webp';
import { Col, Row } from 'antd';
import { Formik, Field, Form } from 'formik';
import Button from '@iso/components/uielements/button';
import TextField from '@iso/components/TextField';
import {
  sortData,
  generateInvitationList,
  isValidEmail,
  tagFormattedEmails,
} from '@iso/lib/helpers/utility';
import { sortOptionList } from '@iso/lib/helpers/appConstant';
import { SearchOutlined } from '@ant-design/icons';
import EmptyComponent from '@iso/components/EmptyComponent';
import {
  fetchPersonalNetworkUsersRequest,
  deletePersonalNetworkConnectionRequest,
  deleteCorporateNetworkConnectionRequest,
  deletePersonalNetworkConnectionSuccessNotify,
} from '@iso/redux/personalNetwork/actions';

import Loader from '@iso/components/utility/loader';
import TagAutocomplete from '@iso/containers/Network/TagAutocomplete';
import DownArrow from '@iso/components/icons/DownArrow';
import RemoveConnection from '@iso/containers/Network/RemoveConnection';
import MenuComponent from '@iso/containers/Network/Menu';
import DropDownComponent from '@iso/containers/Network/Dropdown';
import ConnectionCard from '@iso/containers/Network/ConnectionCard';
import { ImportConnectionDiv } from '@iso/containers/Network/Network.style';
import {
  PersonalNetworkConnectionsWrapper,
  NoConnectionDiv,
  ConnectionListDiv,
  ConnectionWrapper,
} from './PersonalNetworkConnections.style';
import { invitePersonalNetworkUserRequest } from '@iso/redux/personalNetwork/actions';

const NoConnectionComponent = () => {
  return (
    <NoConnectionDiv>
      <Row gutter='10'>
        <Col md={13} sm={24} xs={24}>
          <h2>You don’t have any connections yet.</h2>
          <p>
            Discover gigs on Buddi through your connections and their networks.
            Find your first connection below.
          </p>
        </Col>
        <Col md={11} sm={24} xs={24} className='logo-view'>
          <img src={BuddiIcon} alt='BuddiIcon' />
        </Col>
      </Row>
    </NoConnectionDiv>
  );
};

const PersonalNetworkConnections = () => {
  const SortOptions = sortOptionList;
  const dispatch = useDispatch();

  const { user: authUser } = useSelector((state) => state.Auth);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState(SortOptions[0]);
  const [filteredConnection, setFilteredConnection] = useState([]);
  const formikRef = useRef();
  const [action, setAction] = useState('');
  const connectionForm = { emails: [] };
  const invitationAutoCompleteRef = useRef();

  const [removeConnectionConfirmation, setRemoveConnectionConfirmation] =
    useState({ visible: false, connection: null, error: null });

  const [sendInvited, setSendInvited] = useState(false);
  const { loading, error, professionals } = useSelector(
    (state) => state.PersonalNetwork.invite
  );

  const {
    users: connectionList,
    list: fetchReceivedConnection,
    deleteInvitation: {
      loading: deleteLoading,
      error: deleteError,
      notified: deleteNotified,
    },
  } = useSelector((state) => state.PersonalNetwork);

  const bindPersonalNetworkConnection = () => {
    if (authUser.id) {
      dispatch(fetchPersonalNetworkUsersRequest(authUser.id));
    }
  };
  useEffect(() => {
    bindPersonalNetworkConnection();
  }, [authUser, dispatch]);

  useEffect(() => {
    if (!deleteLoading && !deleteError && action === 'delete') {
      setRemoveConnectionConfirmation({
        visible: false,
        connection: null,
        error: null,
      });
    }

    if (deleteError) {
      setRemoveConnectionConfirmation({
        ...removeConnectionConfirmation,
        error: deleteError,
      });
    }
  }, [deleteLoading, deleteError]);

  useEffect(() => {
    let filtered = [...connectionList];

    if (searchValue) {
      filtered = connectionList.filter((connection) => {
        const { name, email } = connection;
        const filteredByValue = name || email || '';
        return filteredByValue
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
    }

    if (sortBy) {
      const { order, field } = sortBy;
      filtered = sortData(filtered, field, order);
    }

    setFilteredConnection(filtered);
  }, [connectionList, searchValue, sortBy]);

  useEffect(() => {
    if (!deleteLoading && !deleteError && !deleteNotified) {
      notify('success', 'You have removed this profile from your connection');
      dispatch(deletePersonalNetworkConnectionSuccessNotify());
      bindPersonalNetworkConnection();
    }
  }, [deleteLoading]);

  const onRemoveConnectionHandler = (connection) => {
    setRemoveConnectionConfirmation({ visible: true, connection, error: null });
  };

  const handleCancelRemove = () => {
    setRemoveConnectionConfirmation({
      visible: false,
      connection: null,
      error: null,
    });
  };

  const handleUserDelete = () => {
    if (!removeConnectionConfirmation.connection) return;
    setAction('delete');
    debugger;

    switch (removeConnectionConfirmation.connection.source) {
      case 'personal_network':
        dispatch(
            deletePersonalNetworkConnectionRequest(
                removeConnectionConfirmation.connection.id
            )
        );
        break;
      case 'company_network':
        dispatch(
            deleteCorporateNetworkConnectionRequest(
                removeConnectionConfirmation.connection.id
            )
        );
        break;
      default:
        break;
    }
  };

  const onSearchTextChange = (event) => {
    setSearchValue(event.target.value);
  };

  const sendInvitation = (values) => {
    const { emails } = values;
    const latestQuery =
      invitationAutoCompleteRef.current.input.current.props.query;
    setSendInvited(true);
    const emailArr = generateInvitationList(emails, latestQuery);
    let payloadObject = { professionals: emailArr };
    const payload = _.cloneDeep(payloadObject);
    dispatch(invitePersonalNetworkUserRequest(authUser.id, payload));
  };

  useEffect(() => {
    if (!loading && professionals.length > 0 && sendInvited) {
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
      if (sendSuccess) {
        invitationAutoCompleteRef.current.clearInput();
        formikRef.current.resetForm();
        notify('success', 'Send invitation');
      }
    } else if (!loading && error && sendInvited) {
      setSendInvited(false);
      notify('error', 'Failed to send invitation');
    }
  }, [loading, error, professionals]);

  const sortByMenu = (
    <MenuComponent className='custom-menu'>
      {SortOptions.map((so) => (
        <MenuComponent.Item
          className='menuItem'
          onClick={() => setSortBy(so)}
          key={so.value}
        >
          {so.label}
        </MenuComponent.Item>
      ))}
    </MenuComponent>
  );

  const ConnectionListComponent = (
    <ConnectionListDiv>
      <div className='connectionHeader'>
        <div className='connectionListTitle'>
          <h2>{connectionList.length} Connections</h2>
          <div className='connectionListSortBy'>
            <p>Sort by:</p>
            <DropDownComponent
              overlay={sortByMenu}
              overlayClassName='jobMenu'
              placement='bottomRight'
              trigger='click'
            >
              <Button type='link'>
                <strong>{sortBy.label}</strong>
                <DownArrow width={10} height={5} />
              </Button>
            </DropDownComponent>
          </div>
        </div>
        <div className='searchSection'>
          <TextField
            prefixIcon={<SearchOutlined />}
            onChange={onSearchTextChange}
            value={searchValue}
            placeholder='Search'
          ></TextField>
        </div>
      </div>
      <Scrollbar
        autoHeight
        autoHeightMax='calc(100vh - 500px)'
        className='connectionListContent'
      >
        <ConnectionWrapper>
          {filteredConnection.length == 0 ? (
            <EmptyComponent text='You have no users in Network' />
          ) : (
            filteredConnection.map((connection) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                removeConnection={() => onRemoveConnectionHandler(connection)}
              />
            ))
          )}
        </ConnectionWrapper>
      </Scrollbar>
    </ConnectionListDiv>
  );

  return fetchReceivedConnection.loading ? (
    <Loader />
  ) : (
    <PersonalNetworkConnectionsWrapper>
      {connectionList.length ? (
        ConnectionListComponent
      ) : (
        <NoConnectionComponent />
      )}
      <ImportConnectionDiv>
        <Row gutter='10'>
          <Col md={13} sm={24} xs={24}>
            <div className='connectDetail'>
              <h2>Connect with your contacts with Buddi</h2>
              <h3>Directly invite your email contacts to connect on Buddi</h3>
              <Row className='connectForm'>
                <Col md={24} xs={24}>
                  <Formik
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={connectionForm}
                    onSubmit={sendInvitation}
                  >
                    {({ setFieldValue, values }) => (
                      <Form>
                        <label className='fieldLabel'>
                          Enter email addresses here, separated by comma
                        </label>
                        <Field>
                          {() => (
                            <TagAutocomplete
                              ref={invitationAutoCompleteRef}
                              tags={tagFormattedEmails(values.emails)}
                              placeholder=''
                              onChange={(emails) => {
                                const validEmails = emails.filter(
                                  (email) => email && isValidEmail(email.name)
                                );
                                const names = validEmails.map(
                                  (email) => email.name
                                );
                                setFieldValue('emails', names);
                              }}
                            />
                          )}
                        </Field>
                        <Button
                          htmlType='submit'
                          type='primary'
                          shape='round'
                          loading={loading}
                        >
                          Connect
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md={11} sm={24} xs={24} className='benji-monitor-img'>
            <img src={BuddiMonitor} alt='BuddiMonitor' />
          </Col>
        </Row>
      </ImportConnectionDiv>
      {removeConnectionConfirmation.visible && (
        <RemoveConnection
          description={`Are you sure you want to remove ${
            removeConnectionConfirmation.connection.name ||
            removeConnectionConfirmation.connection.email
          } as a connection? Don’t worry, ${
            removeConnectionConfirmation.connection.name ||
            removeConnectionConfirmation.connection.email
          } won’t be notified by LinkedIn.`}
          onCancel={handleCancelRemove}
          onYes={handleUserDelete}
          visible={removeConnectionConfirmation.visible}
        />
      )}
    </PersonalNetworkConnectionsWrapper>
  );
};

export default PersonalNetworkConnections;
