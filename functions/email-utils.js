const admin = require('firebase-admin');
const codeUtils = require('./code-utils');

var SibApiV3Sdk = require('sib-api-v3-sdk');
const { getGcalUrl } = require('./utils');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey =
  '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';

var apiInstance = new SibApiV3Sdk.SMTPApi();

const getDateOptionName = dateOptionId =>
  admin.database().ref(`/dateOptions/${dateOptionId}/name`).once('value');

exports.sendDigestEmail = async (email, params) => {
  const sendSmtpEmail = {
    to: email,
    templateId: 58,
    params,
  };
  console.log('ABOUT TO SEND: ' + JSON.stringify(sendSmtpEmail));
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error(new Error(err));
  }
};

exports.sendBatchedDigestEmail = async batchedEmails => {
  const sendSmtpEmail = {
    templateId: 58,
    messageVersions: batchedEmails,
  };
  console.log('ABOUT TO SEND: ' + JSON.stringify(sendSmtpEmail));
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error(new Error(err));
  }
};

exports.sendNotifyEmail = async (emails, meUser, matchedUser, canDate) => {
  const sendSmtpEmail = {
    to: emails,
    templateId: 23,
    params: { meUser, matchedUser, canDate },
  };
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error(new Error(err));
  }
};

exports.sendDateEmail = async (
  matchId,
  emails,
  meUser,
  matchedUser,
  dateOptionId,
  day,
  formattedDay,
  time,
  description,
  address,
) => {
  const now = Date.now();
  const dailyCodeEmailTime = Date.parse(
    String(day + 14) + ' Feb 2022 10:00:00 GMT',
  );
  const d = new Date();
  const today = d.getUTCDate() - 14 - (d.getUTCHours() < 5 ? 1 : 0);
  // Date is scheduled day of after code is assigned
  const scheduledSameDay = day === today && dailyCodeEmailTime - now < 0;

  // Get and assign code, if necessary
  let code = '';
  if (scheduledSameDay) {
    const codeType = await admin
      .database()
      .ref(`/dateOptions/${dateOptionId}/codeType`)
      .once('value');
    // Gets 1 available code
    const codes = await codeUtils.getCodes(dateOptionId, 1, '');
    code = codes[0];
    if (code) {
      // Assign code and mark as such
      let updates = {};
      updates[`/matches/${matchId}/dateInfo/code`] = code;
      if (codeType.val() !== 'multiuse') {
        updates[`/codes/${dateOptionId}/${code}`] = {
          day: day,
          match: matchId,
        };
      }
      await admin.database().ref().update(updates);
    }
  }
  const dateOptionName = await getDateOptionName(dateOptionId);

  const gcalUrl = getGcalUrl(
    dateOptionName.val(),
    day,
    time,
    address,
    description,
  );

  const dateOption = dateOptionName.val();
  const sendSmtpEmail = {
    to: emails,
    templateId: scheduledSameDay && code ? 75 : 57,
    params: {
      ...{ meUser, matchedUser, dateOption },
      ...(scheduledSameDay && code && { code: code }),
      ...{ day: formattedDay, time, description, address, gcalUrl },
    },
  };
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error(new Error(err));
  }
};

exports.sendCodeEmail = async (
  emails,
  meUser,
  matchedUser,
  dateOptionName,
  code,
  day,
  time,
  description,
  address,
) => {
  const sendSmtpEmail = {
    to: emails,
    templateId: 75,
    params: {
      meUser,
      matchedUser,
      dateOption: dateOptionName,
      code,
      day,
      time,
      description,
      address,
    },
  };
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error(new Error(err));
  }
};

exports.sendDateCancelEmail = async (
  emails,
  meUser,
  matchedUser,
  dateOptionId,
  day,
) => {
  const dateOptionName = await getDateOptionName(dateOptionId);
  const sendSmtpEmail = {
    to: emails,
    templateId: 61,
    params: {
      meUser,
      matchedUser,
      dateOption: dateOptionName.val(),
      day,
    },
  };
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error(new Error(err));
  }
};

exports.sendInviteEmail = async (email, name, crushRoulette) => {
  const sendSmtpEmail = {
    to: email,
    templateId: crushRoulette ? 22 : 24,
    params: { name },
  };
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error(new Error(err));
  }
};

exports.getMatch = matchId =>
  admin.database().ref(`/matches/${matchId}`).once('value');

exports.getMatched = (uid, otherUid) =>
  admin
    .database()
    .ref(`/matchCatalog/${uid}/${otherUid}/matched`)
    .once('value');

exports.updateNotifications = (matchId, uid, otherUid) => {
  let updates = {};
  // Update both users' match notifications
  updates[`/notifs/${uid}/post/matches/${otherUid}/`] = true;
  updates[`/notifs/${otherUid}/post/matches/${uid}`] = true;
  // don't send emails twice
  updates[`/matches/${matchId}/notified`] = true;
  return admin.database().ref().update(updates);
};

exports.getUserEmail = uid =>
  admin.database().ref(`/privateProfile/${uid}/email`).once('value');

exports.getUserName = uid =>
  admin.database().ref(`/smallProfile/${uid}/name`).once('value');

// TODO: change for virtual dates situation
exports.canDateCheck = (canDate, involvedSchools) => {
  if (!canDate || !involvedSchools) {
    return false;
  }

  if (involvedSchools === 'Harvard' || involvedSchools === 'Harvard-MIT') {
    return true;
  }

  return false;
};
