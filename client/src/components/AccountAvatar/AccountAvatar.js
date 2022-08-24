import PropTypes from 'prop-types';
import React from 'react';
import UserAvatar from '@iso/components/UserAvatar';
import { isCompanyAccount } from '@iso/lib/helpers/auth';

const propTypes = {
  account: PropTypes.object,
  size: PropTypes.number
};
const AccountAvatar = ({ account, size }) => {
  const isCompany = isCompanyAccount(account);
  const displayName = isCompany ? account.title : account.fullName;
  const shape = isCompany ? 'square' : 'circle';
  return (
    <>
      <UserAvatar
        url={account.profilePhotoS3Url}
        title={displayName}
        size={size}
        shape={shape}
      />
    </>
  );
};
AccountAvatar.propTypes = propTypes;
export default AccountAvatar;
