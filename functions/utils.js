const admin = require('firebase-admin');

const getEmail = context => context.auth.token.email;

exports.getPublicProfile = uid =>
  admin.database().ref(`/publicProfile/${uid}`).once('value');

exports.isLoggedIn = context => context && context.auth && context.auth.uid;

exports.isDateOptionAdmin = async context => {
  const snapshot = await admin
    .firestore()
    .doc('/portals/date_option_admins')
    .get();
  const dateOptionAdmins = snapshot.data().admins_to_date_option;
  return dateOptionAdmins[getEmail(context)];
};

exports.isSchoolAdmin = async context => {
  const snapshot = await admin.firestore().doc('/portals/school_admins').get();
  const schoolAdmins = snapshot.data().admins_to_school;
  return schoolAdmins[getEmail(context)];
};

exports.currentUser = (context, uid) => context.auth.uid === uid;

exports.getGcalUrl = (name, day, time, address, description) => {
  try {
    let gcalUrl = `https://www.google.com/calendar/render?action=TEMPLATE`;
    gcalUrl += `&text=${encodeURIComponent('Datamatch Date: ' + name)}`;
    if (description) {
      gcalUrl += `&details=${encodeURIComponent(description)}`;
    }
    if (address) {
      gcalUrl += `&location=${encodeURIComponent(address)}`;
    }
    let hour = parseInt(time);
    hour += time.includes('PM') && hour !== 12 ? 12 : 0;
    const startTime = new Date(
      Date.parse(`${day + 14} Feb 2022 ${hour}:00:00 EST`),
    )
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(
      Date.parse(`${day + 14} Feb 2022 ${hour + 1}:00:00 EST`),
    )
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');
    gcalUrl += `&dates=${startTime}/${endTime}`;
    gcalUrl += '&sf=true&output=xml';
    return gcalUrl;
  } catch (e) {
    console.error(e);
    return null;
  }
};
