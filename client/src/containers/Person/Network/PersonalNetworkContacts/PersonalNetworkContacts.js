import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Checkbox } from 'antd';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';

import notify from '@iso/lib/helpers/notify';
import Scrollbar from '@iso/components/utility/customScrollBar';
import BuddiIcon from '@iso/assets/images/benji-icon-01.png';
import Button from '@iso/components/uielements/button';
import TextField from '@iso/components/TextField';
import DownArrow from '@iso/components/icons/DownArrow';
import DropDownComponent from '@iso/containers/Network/Dropdown';
import MenuComponent from '@iso/containers/Network/Menu';
import RemoveConnection from '@iso/containers/Network/RemoveConnection';
import { sortOptionListForContacts } from '@iso/lib/helpers/appConstant';
import ChooseContactType, {
  ChooseContactTypeOption,
} from '@iso/containers/Network/ChooseContactType';
import {
  fetchPersonalNetworkContactsRequest,
  invitePersonalNetworkUserRequest,
  deletePersonalNetworkContactRequest,
  bulkPersonalNetworkAddContactsRequest,
} from '@iso/redux/personalNetwork/actions';
import { sortContact } from '@iso/lib/helpers/utility';
import EmptyComponent from '@iso/components/EmptyComponent';
import Loader from '@iso/components/utility/loader';

import ConnectMoreContact from '../ConnectUser/ConnectMoreContact';
import ContactCard from '../ContactCard/ContactCard';
import {
  PersonalNetworkContactsWrapper,
  NoContactDiv,
  ContactListDiv,
  ContactWrapper,
  SavedContactsDiv,
} from './PersonalNetworkContacts.style';

const PersonalNetworkContacts = () => {
  const SortOptions = sortOptionListForContacts;
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const {
    contacts,

    fetchingContactsList,

    invite: { loading, error, professionals },

    deletingContacts: { loading: deleteLoading, error: deleteError },

    addingContacts: {
      loading: addingContactLoading,
      error: addingContactError,
    },
  } = useSelector((state) => state.PersonalNetwork);
  const [contactList, setContactList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState(SortOptions[0]);
  const [removeContactConfirmation, setRemoveContactConfirmation] = useState({
    visible: false,
    contact: null,
    error: null,
  });

  const [removeBulkContactState, setRemoveBulkContactState] = useState(false);
  const [action, setAction] = useState('');
  const [sendInvited, setSendInvited] = useState(false);
  const [filteredContact, setFilteredContact] = useState([]);
  const [connectMoreUserContact, setConnectMoreUserContact] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);

  useEffect(() => {
    dispatch(fetchPersonalNetworkContactsRequest(authUser.id));
  }, []);

  useEffect(() => {
    const listOfContactsCloned = _.cloneDeep(contacts);
    listOfContactsCloned.forEach((element) => (element.checked = false));
    setContactList(listOfContactsCloned);
  }, [contacts]);

  useEffect(() => {
    if (!loading && professionals.length > 0 && sendInvited) {
      setSendInvited(false);
      setConnectMoreUserContact(false);
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
      if (sendSuccess) notify('success', 'Invitation sent');
      dispatch(fetchPersonalNetworkContactsRequest(authUser.id));
      selectAll(false);
    } else if (!loading && error && sendInvited) {
      setSendInvited(false);
      setConnectMoreUserContact(false);
      notify('error', 'Failed to send invitation');
      selectAll(false);
    }
  }, [loading, error, professionals]);

  const toggleCheck = (id) => {
    let allChecked = true;
    const listOfContactsCloned = _.cloneDeep(contactList);
    if (Array.isArray(listOfContactsCloned) && listOfContactsCloned.length) {
      listOfContactsCloned.forEach((element) => {
        if (element.id === id) {
          element.checked = !element.checked;
        }
        if (!element.checked) {
          allChecked = false;
        }
      });
      setCheckedAll(allChecked);
      setContactList(listOfContactsCloned);
    }
  };

  const sendInvitation = (data) => {
    const payloadObject = { professionals: data };
    const payload = _.cloneDeep(payloadObject);
    dispatch(invitePersonalNetworkUserRequest(authUser.id, payload));
  };

  const sendIndividualInvitation = ({ email }) => {
    setSendInvited(true);
    const emailArr = [];
    emailArr.push({
      full_name: email,
      email: email,
    });
    sendInvitation(emailArr);
  };

  const handleBulkInviteFromList = () => {
    setSendInvited(true);
    const emailArr = [];
    contactList.forEach((contact) => {
      if (
        contact.checked &&
        !contact.isBenjiAccount &&
        !contact.isInvitePending
      ) {
        emailArr.push({
          full_name: contact.email,
          email: contact.email,
        });
      }
    });
    sendInvitation(emailArr);
  };

  useEffect(() => {
    if (!deleteLoading && !deleteError && action === 'delete') {
      setRemoveContactConfirmation({
        visible: false,
        connection: null,
        error: null,
      });
      notify('success', 'Contact deleted successfully');
      setAction('');
    } else if (!deleteLoading && deleteError) {
      notify('error', 'Failed to delete contact');
      setRemoveContactConfirmation({
        ...removeContactConfirmation,
        error: deleteError,
      });
      setAction('');
    }
  }, [deleteLoading, deleteError]);

  const onRemoveContactHandler = (contact) => {
    setRemoveContactConfirmation({ visible: true, contact, error: null });
  };

  const confirmRemoveContactHandler = (id) => {
    if (!removeContactConfirmation && id) return;
    setAction('delete');
    dispatch(
      deletePersonalNetworkContactRequest(
        removeContactConfirmation?.contact?.id || id
      )
    );
  };

  const handleCancelRemove = () => {
    setRemoveBulkContactState(false);
    setRemoveContactConfirmation({
      visible: false,
      connection: null,
      error: null,
    });
  };

  const onBulkRemoveContactHandler = (contact) => {
    if (contacts.length) {
      setRemoveBulkContactState(true);
      setRemoveContactConfirmation({ visible: true, contact, error: null });
    }
  };

  const handleBulkRemoveFromList = () => {
    contactList.forEach((contact) => {
      if (contact.checked) {
        confirmRemoveContactHandler(contact.id);
      }
    });
  };

  useEffect(() => {
    if (!addingContactLoading && !addingContactError && sendInvited) {
      setSendInvited(false);
      setConnectMoreUserContact(false);
      notify('success', 'Contacts invited successfully');
      dispatch(fetchPersonalNetworkContactsRequest(authUser.id));
    } else if (!addingContactLoading && addingContactError && sendInvited) {
      setSendInvited(false);
      setConnectMoreUserContact(false);
      notify('error', 'Failed to invited contacts');
    }
  }, [addingContactLoading, addingContactError]);

  const handleInviteContacts = (values) => {
    if (values.length > 0) {
      setSendInvited(true);
      const payloadObject = { contact_email_list: values };
      const payload = _.cloneDeep(payloadObject);
      dispatch(bulkPersonalNetworkAddContactsRequest(payload));
    }
  };

  const contactTypes = [
    {
      id: 1,
      name: 'Google',
    },
    {
      id: 2,
      name: 'Facebook',
    },
  ];

  const selectAll = (value) => {
    setCheckedAll(value);
    if (contactList.length && Array.isArray(contactList)) {
      contactList.forEach((element) => (element.checked = value));
      setContactList(contactList);
    }
  };

  const onSearchTextChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    let filtered = [...contactList];
    if (filtered.length) {
      if (searchValue) {
        filtered = contactList.filter((contact) => {
          const { fullName, email } = contact;
          const filteredByValue = fullName || email || '';
          return filteredByValue
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        });
      }

      if (sortBy) {
        const { order, field } = sortBy;
        filtered = sortContact(filtered, field, order);
      }
      setFilteredContact(filtered);
    }
  }, [contactList, searchValue, sortBy]);

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

  const NoContactComponent = (
    <NoContactDiv>
      <Row gutter='10'>
        <Col md={12} xs={24}>
          <h2>No contacts added</h2>
          <p>You don't have any contacts.</p>
        </Col>
        <Col md={12} xs={24} className='logo-view'>
          <img src={BuddiIcon} alt='BuddiIcon' />
        </Col>
      </Row>
    </NoContactDiv>
  );

  const ContactListComponent = (
    <ContactListDiv>
      <div className='contactHeader'>
        <div className='contactListTitle'>
          <h2>{contacts?.length} Imported Contacts</h2>
          <div className='contactListSortBy'>
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
      <div className='contactBody'>
        <Row key={'contactListContent'}>
          <Col span={18}>
            {fetchingContactsList.loading ? (
              <Loader />
            ) : contacts.length ? (
              <>
                <div className='contactListActionDiv'>
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    type='checkbox'
                    onChange={(event) => selectAll(event.target.checked)}
                    checked={checkedAll}
                  />
                  <Button
                    className='inviteBtn'
                    shape='round'
                    onClick={handleBulkInviteFromList}
                  >
                    Invite Selected
                  </Button>
                  <Button
                    className='removeBtn'
                    shape='round'
                    onClick={onBulkRemoveContactHandler}
                  >
                    Remove Selected
                  </Button>
                </div>
                <Scrollbar
                  autoHeight
                  autoHeightMax='400px'
                  className='contactListContent'
                >
                  <div className='infinite-scroll'>
                    {filteredContact.length != 0 ? (
                      filteredContact.map((contact, i) => (
                        <ContactWrapper key={i}>
                          <ContactCard
                            contact={contact}
                            toggleCheck={toggleCheck}
                            removeConnection={onRemoveContactHandler}
                            sendInvitation={sendIndividualInvitation}
                          />
                        </ContactWrapper>
                      ))
                    ) : (
                      <>
                        <EmptyComponent text='You have no such contact' />
                      </>
                    )}
                  </div>
                </Scrollbar>
              </>
            ) : (
              NoContactComponent
            )}
          </Col>
          <Col span={6} className='rightAction'>
            <Button
              shape='round'
              icon={<PlusCircleOutlined width={14} height={14} />}
              onClick={() => setConnectMoreUserContact(true)}
            >
              Add more contacts
            </Button>
          </Col>
        </Row>
      </div>
    </ContactListDiv>
  );

  return (
    <PersonalNetworkContactsWrapper>
      <SavedContactsDiv>
        <h3>Saved contacts</h3>
        <ChooseContactType
          showSearch
          placeholder='Choose Contacts'
          style={{ width: '15%' }}
          optionFilterProp='children'
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          className='contactSelect'
        >
          {contactTypes.map((template) => (
            <ChooseContactTypeOption
              key={template.id}
              value={template.id}
              label={template.name}
            >
              {template.name}
            </ChooseContactTypeOption>
          ))}
        </ChooseContactType>
      </SavedContactsDiv>
      {ContactListComponent}
      <RemoveConnection
        description={
          removeBulkContactState
            ? 'Are you sure you want to remove all the contacts?'
            : `Are you sure you want to remove ${
                removeContactConfirmation?.contact?.fullName ||
                removeContactConfirmation?.contact?.email
              } as a contact?`
        }
        visible={removeContactConfirmation?.visible}
        onYes={() => {
          removeBulkContactState
            ? handleBulkRemoveFromList()
            : confirmRemoveContactHandler();
        }}
        onCancel={handleCancelRemove}
      />
      <ConnectMoreContact
        visible={connectMoreUserContact}
        handleCancel={() => {
          setConnectMoreUserContact(false);
        }}
        handleInvitePerson={handleInviteContacts}
      />
    </PersonalNetworkContactsWrapper>
  );
};

export default PersonalNetworkContacts;
