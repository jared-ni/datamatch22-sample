/*eslint-disable */

// Gives the service worker access to specific Firebase libraries.
// Other Firebase libraries are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-functions.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js',
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
// Currently hardcoded since can't access .env file parameters

// TODO: update params to match production firebase
firebase.initializeApp({
  apiKey: 'AIzaSyDTJHsI1eJ-hPV1HC0pvzrxrkRHXLYhEWQ',
  authDomain: 'datamatch2022-test.firebaseapp.com',
  databaseURL: 'https://datamatch2022-test-default-rtdb.firebaseio.com',
  projectId: 'datamatch2022-test',
  storageBucket: 'datamatch2022-test.appspot.com',
  messagingSenderId: '93750537074',
  appId: '1:93750537074:web:67882977ad02807a11cbeb',
});

// TODO: comment out before deploy
// firebase.functions().useEmulator('localhost', 5000);

// // Keeps track of how many unread messages the user currently has.
// var unreadMsgsDict = {};

// function listenForNewMessageNotifs(user) {
//   if (user) {
//     // Gets a database reference to the user's match catalog
//     const db = firebase.database();
//     var path = '/matchCatalog/' + user.uid;
//     const ref = db.ref(path);

//     // Sets up an event handler that runs when the user's match catalog data changes
//     ref.on(
//       'value',
//       snapshot => {
//         var newMsgsDict = {};

//         // Retrieves unread messages from each sender.
//         snapshot.forEach(function (senderSnapshot) {
//           senderSnapshot.forEach(function (valuesSnapshot) {
//             if (valuesSnapshot.key === 'unread') {
//               newMsgsDict[senderSnapshot.key] = valuesSnapshot.val();
//             }
//           });
//         });

//         var oldDictKeys = Object.keys(unreadMsgsDict);
//         var newDictKeys = Object.keys(newMsgsDict);

//         newDictKeys.forEach(function (key) {
//           var inOldDict = oldDictKeys.indexOf(key) >= 0;

//           // Sends a desktop notification if there are more unread messages from a
//           // given user than were previously stored.
//           if (
//             (inOldDict && unreadMsgsDict[key] < newMsgsDict[key]) ||
//             (!inOldDict && newMsgsDict[key] > 0)
//           ) {
//             firebase
//               .functions()
//               .httpsCallable('notifs-newMessageNotification')({ senderId: key })
//               .catch(error => console.log(error));
//           }
//           unreadMsgsDict[key] = newMsgsDict[key];
//         });
//       },
//       errorObject => {
//         console.log('The read failed: ' + errorObject.name);
//       },
//     );
//   }
// }

// Checks Firebase Cloud Messaging & Notifications are supported before setting up
if (firebase.messaging.isSupported()) {
  // firebase.auth().onAuthStateChanged(function (user) {
  //   listenForNewMessageNotifs(user, unreadMsgsDict);
  // });

  // Retrieve an instance of Firebase Messaging and handle background messages
  firebase.messaging().onBackgroundMessage(payload => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload,
    );
    // When message is received if it has notification property it will automatically
    // show a desktop notification, so no need to create one here.
  });
}
