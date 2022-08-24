import React from 'react';
import User from '@iso/components/icons/User';
import Finance from '@iso/components/icons/Finance';

const TopDropdown = () => {
  let menuList = [
    {
      key: 'personal-profile',
      path: '/myprofile',
      label: 'sidebar.managePersonalProfile',
      icon: <User />,
    },
    // {
    //   key: 'finance',
    //   label: 'sidebar.finance',
    //   icon: <Finance fill="none" stroke="#333333" />,
    // },
  ];
  return menuList;
};

export default TopDropdown;
