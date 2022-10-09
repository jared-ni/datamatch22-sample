const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.updateStats = functions.database
  .ref(`/smallProfile/{uid}/onboarded`)
  .onCreate(async snapshot => {
    const parentSnapshot = await snapshot.ref.parent.once('value');
    const parentValue = parentSnapshot.val();

    const { college, onboarded } = parentValue;

    if (!onboarded) {
      return null;
    }

    if (!college) {
      return null;
    }

    const root = snapshot.ref.parent.parent.parent;
    const stats = root.child('stats');
    const statsByCollege = stats.child(college);
    const totals = stats.child('totals');

    const totalUsers = totals.child('users').transaction(x => x + 1);

    const usersByCollege = statsByCollege
      .child('users')
      .transaction(x => x + 1);

    return Promise.all([totalUsers, usersByCollege]);
  });

const colleges = [
  'Bowdoin',
  'Brown',
  'CEGEPS',
  'CMU',
  'Caltech',
  'Carleton',
  'Claremont',
  'Columbia',
  'Cornell',
  'Dartmouth',
  'Emory',
  'FIT',
  'Furman',
  'Harvard',
  'Harvard-MIT',
  'Iowa',
  'LMU',
  'MIT',
  'Macalester',
  'McGill',
  'NYU',
  'Northeastern',
  'OSU',
  'Princeton',
  'Queens',
  'Smith',
  'Tufts',
  'UC Berkeley',
  'UC Davis',
  'UCSD',
  'UCLA',
  'UChicago',
  'UIC',
  'UPenn',
  'USC',
  'UToronto',
  'UW Madison',
  'Vanderbilt',
  'WashU',
  'Yale',
];

exports.populateFirebase = functions.pubsub
  .schedule('59 11 6 2 *')
  .onRun(async () => {
    const data = {};
    colleges.forEach(college => (data[college] = { users: 1 }));
    data.index = 0;
    data.totals = { users: 0 };
    return admin.database().ref('stats').set(data);
  });

exports.updateFirestore = functions.pubsub
  .schedule('*/20 * * * *')
  .onRun(async () => {
    console.log(`Statistics ran at ${new Date().toISOString()}!`);

    const statsSnapshot = await admin.database().ref('stats').once('value');
    const stats = statsSnapshot.val();
    const { index } = stats;

    const userUpdates = {};
    colleges.forEach(college => {
      if (stats[college] != null) {
        userUpdates[`users.${college}.${index}`] = stats[college].users;
      }
    });

    await admin
      .firestore()
      .collection('stats')
      .doc('totals')
      .update(userUpdates);

    return admin
      .database()
      .ref('stats/index')
      .transaction(x => x + 1);
  });
