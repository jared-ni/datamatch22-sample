import React from 'react';

import Sidebar from 'components/Sidebar';

const DateOptionSidebar = ({ mobile }) => {
  const links = [
    {
      to: '/date_option_portal',
      icon: 'home',
      text: 'Home',
    },
    {
      to: '/date_option_portal/check-in',
      icon: 'th-list',
      text: 'Check-in',
    },
  ];

  return <Sidebar links={links} mobile={mobile} />;
};

export default DateOptionSidebar;
