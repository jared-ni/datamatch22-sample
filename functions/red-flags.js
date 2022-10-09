const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { performance } = require('perf_hooks');
var startTime = performance.now();

// Store red flags by counts, i.e. 0-128 is universal; 129-188 is men-specific; 189-231 is women-specific
const universalRedFlags = 128;
const menFlags = 60;
const womenFlags = 43;
const utils = require('./utils');

function getFlagSet(gender) {
  // Return either male + universal or women + universal
  if (gender === 'man') {
    return universalRedFlags + menFlags;
  } else if (gender === 'woman') {
    return universalRedFlags + womenFlags;
  } else {
    return universalRedFlags;
  }
}

function hash(responseArray, mod_val) {
  var responseHash = 0;
  for (let i = 0; i < responseArray.length; i++) {
    let temp =
      responseArray[i] * (5 ** (responseArray.length - i - 1) % mod_val);
    responseHash = (responseHash + temp) % mod_val;
  }
  return responseHash;
}

function choose(n, k) {
  var combinations = 1;
  for (let i = n; i > n - k; i--) {
    combinations *= i;
  }
  var divisor = 1;
  for (let i = 1; i < k + 1; i++) {
    divisor *= i;
  }
  return combinations / divisor;
}

function getRedFlags(gender, responseList, name) {
  const numRedFlags = getFlagSet(gender) + 1;
  const numTargetFlags = 3;
  // MOD_VAL = nCk where n = number of total flags and k = red flags to display; for 100 red flags and k = 5 we have 100C5 = 75287520
  const MOD_VAL = choose(numRedFlags, numTargetFlags);

  // The hash value is essentially the ordered index of a response array within the 5^Q size response array ordering (i.e. if you enumerated all answer choices in ascending fashion)
  const hashIndex = hash(responseList, MOD_VAL);

  let total = 0;
  let finalFlags = [];
  for (let i = 0; i < numRedFlags; i++) {
    for (let j = i + 1; j < numRedFlags; j++) {
      for (let k = j + 1; k < numRedFlags; k++) {
        total++;
        if (total === hashIndex) {
          finalFlags = [i, j, k];
        }
      }
    }
  }

  if (name.toLowerCase().startsWith('j') && gender === 'man') {
    if (!finalFlags.includes(135)) {
      finalFlags.pop();
      // Name starts with J index
      finalFlags.push(135);
    }
  }

  // var backupFlags = 0;
  if (finalFlags.length === 0) {
    while (finalFlags.length < 3) {
      const sample = Math.random() * numRedFlags;
      if (!finalFlags.includes(sample)) {
        finalFlags.push(sample);
      }
    }
  }

  return finalFlags;
}

var endTime = performance.now();
console.log(
  `Local hash implementation took ${endTime - startTime} milliseconds`,
);

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`);
}

exports.getRedFlags = functions.https.onCall(async (_data, context) => {
  if (!utils.isLoggedIn(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'getRedFlags must be called while authenticated.',
    );
  }
  const responsesSnapshot = await admin
    .database()
    .ref(`/responses/${context.auth.uid}`)
    .once('value');
  const responses = responsesSnapshot.val();
  const genderSnapshot = await admin
    .database()
    .ref(`/privateProfile/${context.auth.uid}/gender/genderValue`)
    .once('value');
  const gender = genderSnapshot.val();
  const nameSnapshot = await admin
    .database()
    .ref(`/publicProfile/${context.auth.uid}/name`)
    .once('value');
  const name = nameSnapshot.val();

  const finalFlags = getRedFlags(gender, responses, name);

  let updates = {};
  updates[`privateProfile/${context.auth.uid}/redFlags`] = finalFlags;

  return admin.database().ref().update(updates);
});
