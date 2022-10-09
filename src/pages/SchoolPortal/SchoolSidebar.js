import React from 'react';

import Sidebar from 'components/Sidebar';

const SchoolSidebar = ({ mobile }) => {
  const links = [
    {
      to: '/school_portal',
      icon: 'home',
      text: 'Home',
    },
    {
      to: '/school_portal/school',
      text: 'School',
      icon: 'user',
    },
    {
      to: '/school_portal/team',
      text: 'Team',
      icon: 'users',
    },
    {
      to: '/school_portal/survey',
      icon: 'th-list',
      text: 'Survey',
    },
    {
      to: '/school_portal/preview',
      icon: 'search',
      text: 'Survey Preview',
    },
    {
      to: '/school_portal/dates',
      icon: 'heart',
      text: 'Date Options',
    },
    {
      to: '/school_portal/sponsors',
      icon: 'medal',
      text: 'Sponsors',
    },
  ];

  return <Sidebar links={links} mobile={mobile} />;
};

export default SchoolSidebar;
