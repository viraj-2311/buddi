import React from 'react';
import Dashboard from '@iso/components/icons/Dashboard';
import Jobs from '@iso/components/icons/Jobs';
import Person from '@iso/components/icons/Person';
import Finance from '@iso/components/icons/Finance';
import Document from '@iso/components/icons/Document';
import Message from '@iso/components/icons/Message';
import Help from '@iso/components/icons/Help';
import Setting from '@iso/components/icons/Setting';
import Badge from '@iso/components/uielements/badge';
import Wallet from '@iso/components/icons/Wallet';

const badgeBGColor = '#352e76';
const badgeStyle = { backgroundColor: badgeBGColor, boxShadow: 'none' };

export const personalViewOptions = (
  pending,
  callsheet,
  invitations,
  unpaidInvoices
) => {
  const total = pending.length + callsheet.length;

  return [
    // {
    //   key: 'dashboard',
    //   label: 'sidebar.dashboard',
    //   leftIcon: <Dashboard width={16} height={16} />,
    // },
    {
      key: 'jobs',
      pattern: '/jobs',
      className: 'has-border',
      label: 'sidebar.jobs',
      leftIcon: <Jobs width={16} height={15} fill='#ffffff' />,
      suffix: <Badge count={total} style={badgeStyle} />,
    },
    {
      key: 'finance',
      pattern: '/finance',
      label: 'sidebar.finance',
      leftIcon: <Finance width={16} height={16} />,
      suffix: <Badge count={unpaidInvoices.length} style={badgeStyle} />,
    },
    // {
    //   key: 'documents',
    //   label: 'sidebar.documents',
    //   leftIcon: <Document width={16} height={13} />,
    // },
    {
      key: 'network',
      pattern: '/network',
      label: 'sidebar.personalNetwork',
      leftIcon: <Person width={16} height={16} />,
      suffix: <Badge count={invitations.length} style={badgeStyle} />,
    },
    {
      key: 'wallet',
      pattern: '/wallet',
      label: 'sidebar.wallet',
      leftIcon: <Wallet width={16} height={16} fill={'#fff'} />,
    },
    // {
    //   key: 'messages',
    //   label: 'sidebar.messages',
    //   leftIcon: <Message width={16} height={13} />,
    // },
    {
      key: 'settings',
      pattern: '/settings',
      label: 'sidebar.settings',
      leftIcon: <Setting width={16} height={16} />,
      isBottom: true,
    },
    {
      key: 'help',
      pattern: '/help',
      label: 'sidebar.help',
      leftIcon: <Help width={16} height={16} />,
      isBottom: true,
    },
  ];
};
