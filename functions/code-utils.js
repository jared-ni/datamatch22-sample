const admin = require('firebase-admin'); // used to get access to database
const emailUtils = require('./email-utils');

// Returns up to `totalDates` unused codes for `dateOptionId`
exports.getCodes = async (dateOptionId, totalDates, codeType) => {
  const codes = await admin
    .database()
    .ref(`/codes/${dateOptionId}`)
    .orderByValue()
    .equalTo(false)
    .limitToFirst(codeType === 'multiuse' ? 1 : totalDates)
    .once('value');

  let unusedCodes = [];
  if (!codes.val()) {
    return [];
  }
  for (const code in codes.val()) {
    unusedCodes.push(code);
  }
  return unusedCodes;
};

// Send email
exports.notifyCode = async (
  matchId,
  code,
  dateOptionName,
  day,
  time,
  description,
  address,
) => {
  // Parse matchId
  const uids = matchId.split('-');
  const uid = uids[0];
  const otherUid = uids[1];

  const emailsSnapshot = await Promise.all([
    emailUtils.getUserEmail(uid),
    emailUtils.getUserEmail(otherUid),
  ]);
  const emails = emailsSnapshot.map(snap => ({ email: snap.val() }));

  const namesSnapshot = await Promise.all([
    emailUtils.getUserName(uid),
    emailUtils.getUserName(otherUid),
  ]);
  const names = namesSnapshot.map(snap => snap.val());

  const formattedDay = `2/${14 + day}`;

  return emailUtils.sendCodeEmail(
    emails,
    names[0],
    names[1],
    dateOptionName,
    code,
    formattedDay,
    time,
    description,
    address,
  );
};
