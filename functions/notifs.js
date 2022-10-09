const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('./utils');

// Set this in the CLI - https://firebase.google.com/docs/functions/config-env
const BASE_URL = functions.config().datamatch.url;

// Sends a notification via Firebase Cloud Messaging to the given client token.
// notification = can include title, body and imageUrl properties
// link = HTTPS URL to open when notification is clicked
// expiryTime = time in seconds notif should attempt to be delivered before being discarded (4 week default is max)
// webpushNotif = properties listed here: https://firebase.google.com/docs/reference/admin/node/firebase-admin.messaging.webpushnotification.md
const sendNotification = ({
  token,
  notification,
  link,
  expiryTime,
  webpushNotif,
}) => {
  // Get messaging instance & create message payload
  const messaging = admin.messaging();
  const message = {
    token,
    notification,
    webpush: {
      headers: { TTL: expiryTime || '2419200' },
      fcm_options: { link },
      notification: webpushNotif,
    },
  };

  // Send a message to provided client token
  messaging
    .send(message)
    .then(response => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};

// WIP schedule function HAS NOT BEEN TESTED but this should launch the incomplete notifs without any button
// exports.scheduledFunctionCrontab = functions.pubsub.schedule('every minute')
//   .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
//   .onRun(() => {
//     this.props.firebase
//                 .functions()
//                 .httpsCallable('notifs-incompNotification')({})
//                 .catch(error => console.log(error))
//     console.log('This will be run every day at 11:05 AM Eastern!');
//   return null;
// });

// Cloud function that sends the new message notification to the user
// Only parameter is otherUid - id of user who message was sent to
exports.newMessageNotif = functions.https.onCall(async (data, context) => {
  // Check user is logged in
  if (!utils.isLoggedIn(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'newMessageNotification must be called while authenticated.',
    );
  }

  // Check if other user has matched with this user before allowing notifications to send
  const catalog = await admin
    .database()
    .ref(`/matchCatalog/${data.otherUid}/${context.auth.uid}`)
    .once('value');
  if (!catalog.exists() || !catalog.val().matched) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Other user has not matched with user.',
    );
  }

  if (catalog.val().reported) {
    console.log('The other user has been reported');
    return;
  }

  // Get other user's notification token from the database & check it exists
  const token = await admin
    .database()
    .ref(`/notifs/${data.otherUid}/token`)
    .once('value');

  // Other user has not allowed notifications
  if (!token.exists()) {
    return;
  }

  // Get message sender's name from the database
  const senderName = await admin
    .database()
    .ref(`/smallProfile/${context.auth.uid}/name`)
    .once('value');

  // Call helper function to send notification
  sendNotification({
    token: token.val(),
    notification: {
      title: 'You have a new message!',
      body: `New message from ${senderName.val()}!`,
    },
    link: `${BASE_URL}/app/messages/${context.auth.uid}`,
    webpushNotif: {
      requireInteraction: true,
      icon: `${BASE_URL}/notif-icon.png`,
    },
  });
});
