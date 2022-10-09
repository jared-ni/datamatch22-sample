/** @jsx jsx */

import { jsx } from 'theme-ui';

const ChatNowServing = ({
  message = { icon: 'harvard.png', sender: 'senior @ harvard' },
}) => {
  if (!message) {
    return null;
  }

  return (
    <div className="messageContainer" sx={{ bg: 'light-pink' }}>
      <img
        style={{ width: '19px', height: '19px', marginRight: '8px' }}
        src={require('assets/school_logos/' + message.icon).default}
        alt={message.icon}
      />
      {message.sender} signed up for Datamatch
    </div>
  );
};

export default ChatNowServing;
