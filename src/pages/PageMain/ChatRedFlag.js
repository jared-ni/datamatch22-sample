/** @jsx jsx */

import { jsx } from 'theme-ui';

const ChatRedFlag = ({ message }) => {
  return (
    <div className="messageContainer" sx={{ bg: 'lightPink' }}>
      <img
        style={{ width: '19px', height: '19px', marginRight: '8px' }}
        src={require('assets/school_logos/' + message.icon).default}
        alt={message.icon}
      />
      {message.college} Red Flag: {message.text}
    </div>
  );
};

export default ChatRedFlag;
