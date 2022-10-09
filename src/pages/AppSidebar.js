import React from 'react';

import Sidebar from 'components/Sidebar';

/* Prepares all the link data to give to the Sidebar component */
const AppSidebar = ({ mobile, toggleModal }) => {
  const links = [
    { to: '/app/home', icon: 'home', text: 'Home' },
    {
      to: '/app/survey',
      icon: 'th-list',
      text: 'Survey',
    },
    {
      to: '/app/results',
      icon: 'heart',
      text: 'Matches',
    },
    {
      to: '/app/roulette',
      icon: 'users',
      text: 'Roulette',
    },
    {
      to: '/app/stats',
      icon: 'chart-area',
      text: 'Stats',
    },
    {
      to: '/app/sponsors',
      icon: 'medal',
      text: 'Sponsors',
    },
    {
      to: '/app/team',
      icon: 'users',
      text: 'Team',
    },
    { to: '/app/faq', icon: 'question', tooltip: 'homepage', text: 'FAQ' },
  ];

  return (
    <Sidebar
      isApp={true}
      links={links}
      mobile={mobile}
      toggleModal={toggleModal}
    />
  );
};

export default AppSidebar;
