const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('./utils');

const fullNameSearch = search =>
  admin
    .database()
    .ref('searchIndex')
    .orderByChild('searchName')
    .startAt(search)
    .limitToFirst(10)
    .once('value');

const lastNameSearch = search =>
  admin
    .database()
    .ref('searchIndex')
    .orderByChild('last')
    .startAt(search)
    .limitToFirst(10)
    .once('value');

const emailSearch = search =>
  admin
    .database()
    .ref('emailToName')
    .orderByKey()
    .startAt(search)
    .limitToFirst(5)
    .once('value');

exports.emailSearch = functions.https.onCall(async ({ email }, context) => {
  if (!utils.isLoggedIn(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'userSearch must be called while authenticated.',
    );
  }

  const encodedEmail = email.toLowerCase().replace(/\./g, ',');

  let searchResults = [];
  const dataSnapshot = await emailSearch(encodedEmail);

  dataSnapshot.forEach(childSnapshot => {
    const childEmail = childSnapshot.key;
    const childName = childSnapshot.val();
    if (childEmail.includes(encodedEmail)) {
      // regex is for replacing all commas with dots
      searchResults.push({
        email: childEmail.replace(/,/g, '.'),
        name: childName,
      });
    }
  });
  return searchResults;
});

exports.userSearch = functions.https.onCall(
  async ({ first, last }, context) => {
    if (!utils.isLoggedIn(context)) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'userSearch must be called while authenticated.',
      );
    }

    let searchResults = [];
    const formattedSearch = last ? first + ' ' + last : first;
    const dataSnapshot = await fullNameSearch(formattedSearch);

    dataSnapshot.forEach(childSnapshot => {
      const childValue = childSnapshot.val();
      const childName = childValue.searchName.split(' ');
      const childFirst = childName[0];
      const childLast = childName[1] || '';

      if (childFirst.includes(first) && childLast.includes(last || '')) {
        searchResults.push(childSnapshot.key);
      }
    });

    if (!last) {
      const dataSnapshot = await lastNameSearch(formattedSearch);
      dataSnapshot.forEach(childSnapshot => {
        const childValue = childSnapshot.val();
        const childLast = childValue.last || '';
        if (childLast.includes(formattedSearch)) {
          searchResults.push(childSnapshot.key);
        }
      });
    }

    const uid = context.auth.uid;
    return searchResults.filter(key => key !== uid);
  },
);

exports.makeSchoolAdmin = functions.https.onCall(async (_data, context) => {
  if (!utils.isLoggedIn(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'makeSchoolAdmin must be called while authenticated.',
    );
  }

  const schoolAdmin = await utils.isSchoolAdmin(context);
  if (!schoolAdmin) {
    return null;
  }

  await admin
    .database()
    .ref(`/smallProfile/${context.auth.uid}`)
    .update({ schoolAdmin });

  return schoolAdmin;
});

exports.makeDateOptionAdmin = functions.https.onCall(async (_data, context) => {
  if (!utils.isLoggedIn(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'makeDateOptionAdmin must be called while authenticated.',
    );
  }

  const dateOptionAdmin = await utils.isDateOptionAdmin(context);
  if (!dateOptionAdmin) {
    return null;
  }

  await admin
    .database()
    .ref(`/smallProfile/${context.auth.uid}`)
    .update({ dateOptionAdmin });

  return dateOptionAdmin;
});
