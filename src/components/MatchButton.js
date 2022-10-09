import React from 'react';
import { Button } from 'theme-ui';

const MatchButton = ({
  hasMatched,
  initiateMatch,
  match,
  matchStatus,
  otherUid,
}) => {
  const love = (match || {}).relationshipType === 'true love';
  const icon = love ? 'heart' : 'smile-beam';
  const statusMessage = !hasMatched
    ? 'Match'
    : matchStatus
    ? 'Matched!'
    : 'Pending...';

  return (
    <Button
      id="match"
      variant="accent"
      onClick={() => initiateMatch(otherUid, hasMatched)}
    >
      {/* TODO: add tooltip describing what the status means */}
      <i className={`far fa-${icon}`} />
      {` `}
      {statusMessage}
    </Button>
  );
};

export default MatchButton;
