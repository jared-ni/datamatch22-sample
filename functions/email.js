const functions = require('firebase-functions');
const utils = require('./utils');
const admin = require('firebase-admin');
const emailUtils = require('./email-utils');
const { notifyCode, getCodes } = require('./code-utils');

exports.notifyMatched = functions.https.onCall(
  async ({ uid, otherUid, matchId }, context) => {
    if (!utils.isLoggedIn(context)) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'notifyMatched must be called while authenticated.',
      );
    }

    if (!uid || uid !== context.auth.uid || !otherUid || !matchId) {
      return;
    }

    const catalogsSnapshot = await Promise.all([
      emailUtils.getMatched(uid, otherUid),
      emailUtils.getMatched(otherUid, uid),
    ]);
    const [matched, otherMatched] = catalogsSnapshot.map(snap => snap.val());

    // not a valid match
    if (!matched || !otherMatched) {
      return;
    }

    const matchSnapshot = await emailUtils.getMatch(matchId);
    const matchInfo = matchSnapshot.val();

    // already notified
    if (matchInfo.notified) {
      return;
    }

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

    const canDate = emailUtils.canDateCheck(
      matchInfo.canDate,
      matchInfo.involvedSchools,
    );

    await emailUtils.sendNotifyEmail(emails, names[0], names[1], canDate);
    return emailUtils.updateNotifications(matchId, uid, otherUid);
  },
);

exports.notifyDate = functions.https.onCall(
  async (
    { matchId, uid, otherUid, dateOptionId, day, time, description, address },
    context,
  ) => {
    if (!utils.isLoggedIn(context)) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'notifyDate must be called while authenticated.',
      );
    }

    if (
      !uid ||
      uid !== context.auth.uid ||
      !otherUid ||
      !matchId ||
      !dateOptionId ||
      day === null ||
      day === undefined ||
      !time ||
      !description
    ) {
      return;
    }

    const matchSnapshot = await emailUtils.getMatch(matchId);
    const matchInfo = matchSnapshot.val();
    if (
      !matchInfo.dateInfo ||
      matchInfo.dateInfo.dateOptionId !== dateOptionId ||
      matchInfo.dateInfo.day !== day
    ) {
      return;
    }

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

    await emailUtils.sendDateEmail(
      matchId,
      emails,
      names[0],
      names[1],
      dateOptionId,
      day,
      formattedDay,
      time,
      description,
      address,
    );

    // TODO: notifications?
    return;
  },
);

exports.notifyDateCancel = functions.https.onCall(
  async ({ matchId, uid, otherUid, dateOptionId, day }, context) => {
    if (!utils.isLoggedIn(context)) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'notifyDateCancel must be called while authenticated.',
      );
    }

    if (
      !uid ||
      uid !== context.auth.uid ||
      !otherUid ||
      !matchId ||
      !dateOptionId ||
      day === null ||
      day === undefined
    ) {
      return;
    }

    const matchSnapshot = await emailUtils.getMatch(matchId);
    const matchInfo = matchSnapshot.val();
    if (matchInfo.dateInfo) {
      return;
    }

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

    await emailUtils.sendDateCancelEmail(
      emails,
      names[0],
      names[1],
      dateOptionId,
      formattedDay,
    );

    // TODO: notifications?
    return;
  },
);

exports.inviteCrushRoulette = functions.https.onCall(
  async ({ invitedUserEmail, invitedUserName }, context) => {
    if (!utils.isLoggedIn(context)) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'inviteCrushRoulette must be called while authenticated.',
      );
    }

    if (!invitedUserEmail || !invitedUserName) {
      return;
    }

    await emailUtils.sendInviteEmail(
      [{ email: invitedUserEmail }],
      invitedUserName,
      true,
    );

    return;
  },
);

exports.inviteSearch = functions.https.onCall(
  async ({ invitedUserEmail, invitedUserName }, context) => {
    if (!utils.isLoggedIn(context)) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'inviteSearch must be called while authenticated.',
      );
    }

    if (!invitedUserEmail || !invitedUserName) {
      return;
    }

    await emailUtils.sendInviteEmail(
      [{ email: invitedUserEmail }],
      invitedUserName,
      false,
    );

    return;
  },
);

// Scheduled to run from Feb 15-20 at 5:05 am
exports.notifyCodesDaily = functions
  .runWith({ failurePolicy: true, timeoutSeconds: 540, memory: '4GB' })
  .pubsub.schedule('15, 16, 17, 18, 19, 20 of feb 05:00')
  .timeZone('America/New_York')
  .onRun(async context => {
    // Get matches scheduled for `day`
    const d = new Date();
    let day = d.getDate() - 14;

    console.log(`Assigning codes for day ${day}`);

    const matchesQuery = admin
      .database()
      .ref('/matches')
      .orderByChild('dateInfo/day')
      .equalTo(day);

    let matchesGrouped = {};
    return matchesQuery.once('value', async matchSnapshots => {
      // Group matches by date option
      matchSnapshots.forEach(matchSnapshot => {
        const matchValue = matchSnapshot.val();
        const confirmed = matchValue.dateInfo.confirmed;
        const code = matchValue.dateInfo.code;
        const dateOptionId = matchValue.dateInfo.dateOptionId;
        // Only assign code to match if it's confirmed and doesn't have a code
        if (confirmed && !code) {
          if (!(dateOptionId in matchesGrouped)) {
            matchesGrouped[dateOptionId] = [];
          }
          matchesGrouped[dateOptionId].push(matchSnapshot);
        }
      });

      // Create array of promises that create database updates for codes assigned to matches
      for (const dateOptionId in matchesGrouped) {
        const matches = matchesGrouped[dateOptionId];
        const totalDates = matches.length;
        const dateOption = await admin
          .database()
          .ref(`/dateOptions/${dateOptionId}`)
          .once('value');
        const dateOptionInfo = dateOption.val();
        const codeType = dateOptionInfo.codeType;
        const dateOptionName = dateOptionInfo.name;

        // Get unused codes for `dateOptionId`
        const codes = await getCodes(dateOptionId, totalDates, codeType);

        // Iterate over matches at `dateOptionId` and assign code
        for (var i = 0; i < totalDates; i++) {
          try {
            const updates = {};
            const matchSnapshot = matches[i];
            const matchId = matchSnapshot.key;
            const matchInfo = matchSnapshot.val();
            const code = codes[codeType === 'multiuse' ? 0 : i];
            // If no code, just skip
            if (!code) {
              continue;
            }
            updates[`/matches/${matchId}/dateInfo/code`] = code;

            // Mark code as assigned
            if (codeType !== 'multiuse') {
              updates[`/codes/${dateOptionId}/${code}`] = {
                day: day,
                match: matchId,
              };
            }

            // Assign code (update db and send email)
            console.log(`Assigning code to ${matchId}`);
            await admin.database().ref().update(updates);
            await notifyCode(
              matchId,
              code,
              dateOptionName,
              day,
              matchInfo.dateInfo.time,
              dateOptionInfo.description,
              dateOptionInfo.address,
            );
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
  });

exports.dailyNotifsDigest = functions
  .runWith({ memory: '4GB', timeoutSeconds: 540 })
  .pubsub.schedule('14, 15, 16, 17, 18, 19, 20 of feb 21:00')
  .timeZone('America/New_York')
  .onRun(async context => {
    const emails = [];

    var today = new Date();
    const current_day =
      today.getUTCDate() - 14 - (today.getUTCHours() < 5 ? 1 : 0);

    const matchCatalog = (
      await admin.database().ref('/matchCatalog').get()
    ).val();

    const privateProfiles = (
      await admin.database().ref('/privateProfile').get()
    ).val();

    const matches = (await admin.database().ref('/matches').get()).val();

    for (const uid1 in privateProfiles) {
      let new_matches = 0;
      let unread = 0;
      let dates = 0;

      if (uid1 in matchCatalog) {
        for (const uid2 in matchCatalog[uid1]) {
          const match = matchCatalog[uid1][uid2];
          if (match['matched']) {
            if (!('unread' in match)) {
              if (
                uid2 in matchCatalog &&
                uid1 in matchCatalog[uid2] &&
                matchCatalog[uid2][uid1].matched &&
                !('unread' in matchCatalog[uid2][uid1])
              ) {
                new_matches += 1;
              }
            } else if (match['unread'] > 0) {
              unread += match['unread'];
            }

            const matchId = uid1 < uid2 ? `${uid1}-${uid2}` : `${uid2}-${uid1}`;

            if (
              matchId in matches &&
              'dateInfo' in matches[matchId] &&
              'day' in matches[matchId]['dateInfo'] &&
              matches[matchId].dateInfo.day >= current_day
            ) {
              dates += 1;
            }
          }
        }

        if (current_day === 1 || new_matches + unread + dates > 0) {
          const params = {
            day: `2/${14 + current_day}`,
            new_matches,
            unread,
            dates,
          };
          const address = privateProfiles[uid1].email;
          emails.push({
            to: [{ email: address }],
            params,
          });
        }
      }
    }

    // Batch emails
    const batchSize = 3;
    for (var i = 0; i < emails.length; i += batchSize) {
      await emailUtils.sendBatchedDigestEmail(emails.slice(i, i + batchSize));
    }
  });
