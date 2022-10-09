/** @jsx jsx */

import { jsx } from 'theme-ui';

const ChatStatistic = ({ message }) => (
  <div
    className="messageContainer"
    sx={{ bg: 'lightBlue', color: 'blue', margin: '15px 20px 15px 0px' }}
  >
    <div style={{ fontSize: '50px', marginRight: '10px' }}>
      {message.percentage}%
    </div>
    <div style={{ fontSize: '16px', justifyContent: 'center' }}>
      {message.description}
    </div>
  </div>
);

export default ChatStatistic;
