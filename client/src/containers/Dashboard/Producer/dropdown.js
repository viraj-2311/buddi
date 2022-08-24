import React from 'react';
import User from '@iso/components/icons/User';
import { ReactComponent as CompanyIcon } from '@iso/assets/images/CompanyIconBlack.svg';

import { useSelector } from 'react-redux';
import Finance from '@iso/components/icons/Finance';
import Invite from '@iso/components/icons/Invite';
import { isExecutiveProducer } from '@iso/lib/helpers/auth';

const TopDropdown = (user) => {
  let menuList = [];
  const { companyId } = useSelector((state) => state.AccountBoard);
  if (companyId) {
    menuList.push({
      key: 'company-profile',
      path: `/companies/${companyId}/band-profile`,
      label: 'sidebar.manageCompanyProfile',
      icon: <CompanyIcon />,
    });
  } else {
    menuList.push({
      key: 'personal-profile',
      path: '/myprofile',
      label: 'sidebar.personalProfile',
      icon: <User />,
    });
  }

  // if (isExecutiveProducer(user)) {
  //   menuList.push(
  //     {
  //       key: 'finance',
  //       label: 'sidebar.finance',
  //       icon: <Finance fill="none" />,
  //     },
  //     {
  //       key: 'invite',
  //       path: '/invitation',
  //       label: 'topbar.invite',
  //       icon: <Invite />,
  //     }
  //   );
  // } else {
  //   menuList.push({
  //     key: 'finance',
  //     label: 'sidebar.finance',
  //     icon: <Finance fill="none" />,
  //   });
  // }
  return menuList;
};

export default TopDropdown;
