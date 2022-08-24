import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PersonalNetworkViewWrapper from './View.style';
import SinglePersonalNetworkUser from './SingleNetworkUser';
import Button from '@iso/components/uielements/button';
import EmptyComponent from '@iso/components/EmptyComponent';
import Input from '@iso/components/uielements/input';
import ConfirmModal from '@iso/components/Modals/Confirm'
import { RadioButton, RadioGroup } from '@iso/components/uielements/radio';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import Loader from '@iso/components/utility/loader';
import {
  fetchPersonalNetworkUsersRequest,
  setFavoritePersonalNetworkUserRequest,
  deletePersonalNetworkUserRequest
} from '@iso/redux/personalNetwork/actions';
import _ from 'lodash';

const SortOptions = [
  {label: 'Name', value: 'name'},
  {label: 'Favorite', value: 'favorite'},
  {label: 'Job Role', value: 'companyTitle, jobTitle'},
  {label: 'Last Updated', value: 'createdDate'},
];

const PersonalNetworkView = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { users, list: {loading, error}, delete: {loading: deleteLoading, error: deleteError} } = useSelector(state => state.PersonalNetwork);

  const [keyword, setKeyword] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [action, setAction] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({visible: false, user: null, error: null});

  useEffect(() => {
    setAction('list');
    dispatch(fetchPersonalNetworkUsersRequest(authUser.id));
  }, [authUser]);

  useEffect(() => {
    if (!loading && !error && action === 'list') {
      setShowLoader(false);
    }

    if (!loading && action === 'list') {
      setAction('');
    }
  }, [loading, error]);

  useEffect(() => {
    if (!deleteLoading && !deleteError && action === 'delete') {
      setDeleteConfirm({visible: false, user: null, error: null});
    }

    if (deleteError) {
      setDeleteConfirm({...deleteConfirm, error: deleteError});
    }
  }, [deleteLoading, deleteError]);

  useEffect(() => {
    let filtered = [...users];
    if (keyword) {
      filtered = users.filter(user => user.name.toLowerCase().includes(keyword.toLowerCase()));
    }

    if (sortBy) {
      const options = sortBy.split(',');
      filtered = _.sortBy(filtered, options);
    }

    setFilteredUsers(filtered);
  }, [users, keyword, sortBy]);

  const resetFilter = () => {
    setKeyword(null);
    setSortBy(null);
  };

  const onUserDelete = (user) => {
    setDeleteConfirm({visible: true, user, error: null});
  };

  const handleUserFavorite = (user) => {
    const payload = {friendId: user.friendId};
    dispatch(setFavoritePersonalNetworkUserRequest(authUser.id, payload));
  };

  const handleUserDelete = () => {
    if (!deleteConfirm.user) return;
    setAction('delete');
    dispatch(deletePersonalNetworkUserRequest(deleteConfirm.user.id));
  };

  if (showLoader) {
    return <Loader />
  }

  return (
    <PersonalNetworkViewWrapper>
      <div className="networkSearchBoxWrapper">
        <Input
          bordered={false}
          className="searchBox"
          prefix={<SearchOutlined />}
          placeholder="Search Message or Name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="networkSortOptionWrapper">
        <div className="sortLabel">Sort By</div>
        <RadioGroup
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SortOptions.map((option, index) => (
            <RadioButton className="sortOption" value={option.value} key={`sort-option-${index}`}>{option.label}</RadioButton>
          ))}
        </RadioGroup>
        <Button type="link" onClick={resetFilter}><SyncOutlined /></Button>
      </div>
      <div className="networkUserListWrapper">
        <ConfirmModal
          key="delete-network-user-confirm"
          visible={deleteConfirm.visible}
          description="Do you really want to delete the user? This action cannot be undone."
          confirmLoading={deleteLoading}
          onYes={handleUserDelete}
          onNo={() => setDeleteConfirm({visible: false, user: null, error: null})}
        />
        {filteredUsers.length == 0
          ? <EmptyComponent text="You have no users in Network" />
          : (
            filteredUsers.map((user, index) =>
              (<SinglePersonalNetworkUser key={`network-user-${index}`} user={user} onFavorite={handleUserFavorite} onDelete={onUserDelete} />)
            )
          )
        }
      </div>
    </PersonalNetworkViewWrapper>
  )
};

export default PersonalNetworkView;
