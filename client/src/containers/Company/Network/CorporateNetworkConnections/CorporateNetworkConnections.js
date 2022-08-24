import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import notify from '@iso/lib/helpers/notify';
import { SearchOutlined } from '@ant-design/icons';
import Scrollbar from '@iso/components/utility/customScrollBar';
import BuddiIcon from '@iso/assets/images/benji-icon-01.png';
import { Col, Row } from 'antd';
import Button from '@iso/components/uielements/button';
import { Formik, Field, Form } from 'formik';
import BuddiMonitor from '@iso/assets/images/buddi-contacts.webp';
import TextField from '@iso/components/TextField';
import { sortOptionList } from '@iso/lib/helpers/appConstant';
import {
  sortData,
  generateInvitationList,
  isValidEmail,
  tagFormattedEmails,
} from '@iso/lib/helpers/utility';
import ConnectionCard from '@iso/containers/Network/ConnectionCard';
import RemoveConnection from '@iso/containers/Network/RemoveConnection';
import EmptyComponent from '@iso/components/EmptyComponent';
import SwiperSlider from '@iso/components/shared/SwiperSlider';
import CompanyNetworkCrewCard from '../CompanyNetworkCrewCard';
import Loader from '@iso/components/utility/loader';
import TagAutocomplete from '@iso/containers/Network/TagAutocomplete';
import DownArrow from '@iso/components/icons/DownArrow';
import MenuComponent from '@iso/containers/Network/Menu';
import DropDownComponent from '@iso/containers/Network/Dropdown';
import {
  fetchCompanyNetworkUsersRequest,
  deleteCompanyNetworkConnectionRequest,
  deleteCompanyNetworkConnectionSuccessNotify,
} from '@iso/redux/companyNetwork/actions';
import {
  CorporateNetworkConnectionsWrapper,
  NoConnectionDiv,
  ConnectionListDiv,
  ConnectionWrapper,
  CompanyNetworkCrew,
} from './CorporateNetworkConnections.style';
import { ImportConnectionDiv } from '@iso/containers/Network/Network.style';
import { inviteCompanyNetworkUserRequest } from '@iso/redux/companyNetwork/actions';

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

const CorporateNetworkConnections = () => {
  const SortOptions = sortOptionList;
  const dispatch = useDispatch();
  const connectionForm = { emails: [] };
  const { companyId } = useSelector((state) => state.ProducerJob);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState(SortOptions[0]);
  const [filteredConnection, setFilteredConnection] = useState([]);
  const [action, setAction] = useState('');
  const formikRef = useRef();
  const invitationAutoCompleteRef = useRef();

  const [removeConnectionConfirmation, setRemoveConnectionConfirmation] =
    useState({ visible: false, connection: null, error: null });

  const [sendInvited, setSendInvited] = useState(false);
  const { loading, error, professionals } = useSelector(
    (state) => state.CompanyNetwork.invite
  );

  const {
    users: connectionList,
    list: fetchReceivedConnection,
    deleteInvitation: {
      loading: deleteLoading,
      error: deleteError,
      notified: deleteNotified,
    },
  } = useSelector((state) => state.CompanyNetwork);

  const bindCompanyNetworkConnection = () => {
    if (companyId) {
      dispatch(
        fetchCompanyNetworkUsersRequest(companyId, {
          status: 'Accepted',
        })
      );
    }
  };

  useEffect(() => {
    bindCompanyNetworkConnection();
  }, [companyId, dispatch]);

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
      dispatch(deleteCompanyNetworkConnectionSuccessNotify());
      bindCompanyNetworkConnection();
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
    dispatch(
      deleteCompanyNetworkConnectionRequest(
        removeConnectionConfirmation.connection.id
      )
    );
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
    dispatch(inviteCompanyNetworkUserRequest(companyId, payload));
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
      <div className='connectionListContent'>
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
      </div>
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
    </ConnectionListDiv>
  );

  const params = {
    slidesPerView: 5,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  return fetchReceivedConnection.loading ? (
    <Loader />
  ) : (
    <CorporateNetworkConnectionsWrapper>
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
                    {({ values, setFieldValue }) => (
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

      {/* DON'T REMOVE BELOW COMMENT --- this company network crew section is no used now, we may need this in a future */}

      {/* <CompanyNetworkCrew>
        <div className="network-crew-header">
          <h2 className="title">Company Network Crew</h2>
          <a>See all</a>
        </div>

        <div className="info swiper-slider">
          <SwiperSlider {...params}>
            {companyNetworkCrewList.map((e) => (
              <div key={e.id}>
                <CompanyNetworkCrewCard networkProfile={e} />
              </div>
            ))}
          </SwiperSlider>
        </div>
      </CompanyNetworkCrew> */}
    </CorporateNetworkConnectionsWrapper>
  );
};

export default CorporateNetworkConnections;
