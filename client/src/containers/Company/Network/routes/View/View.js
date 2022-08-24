import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CompanyNetworkViewWrapper from './View.style';
import SingleCompanyNetworkUser from './SingleNetworkUser';
import Button from '@iso/components/uielements/button';
import ConfirmModal from '@iso/components/Modals/Confirm'
import EmptyComponent from '@iso/components/EmptyComponent';
import Input from '@iso/components/uielements/input';
import { RadioButton, RadioGroup } from '@iso/components/uielements/radio';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import Loader from '@iso/components/utility/loader';
import {
  fetchCompanyNetworkUsersRequest,
  setFavoriteCompanyNetworkUserRequest,
  deleteCompanyNetworkUserRequest
} from '@iso/redux/companyNetwork/actions';
import _ from 'lodash';

const SortOptions = [
  {label: 'Name', value: 'name'},
  {label: 'Favorite', value: 'favorite'},
  {label: 'Job Role', value: 'companyTitle, jobTitle'},
  {label: 'Last Updated', value: 'createdDate'},
];

const CompanyNetworkView = () => {
  const dispatch = useDispatch();
  const { companyId } = useSelector(state => state.ProducerJob);
  const { users, list: {loading, error}, delete: {loading: deleteLoading, error: deleteError} } = useSelector(state => state.CompanyNetwork);

  const [keyword, setKeyword] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [action, setAction] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({visible: false, user: null, error: null});

  useEffect(() => {
    setAction('list');
    dispatch(fetchCompanyNetworkUsersRequest(companyId));
  }, [companyId]);

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
    dispatch(setFavoriteCompanyNetworkUserRequest(companyId, payload));
  };

  const handleUserDelete = () => {
    if (!deleteConfirm.user) return;
    setAction('delete');
    dispatch(deleteCompanyNetworkUserRequest(deleteConfirm.user.id));
  };

  if (showLoader) {
    return <Loader />
  }

  return (
    <CompanyNetworkViewWrapper>
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
              (<SingleCompanyNetworkUser key={`network-user-${index}`} user={user} onFavorite={handleUserFavorite} onDelete={onUserDelete} />)
            )
          )
        }
      </div>
    </CompanyNetworkViewWrapper>
  )
};

export default CompanyNetworkView;
