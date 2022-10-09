const admin = require('firebase-admin');
const user = require('./user');
const stats = require('./stats');
const email = require('./email');
const image = require('./image');
const spotify = require('./spotify');
const notifs = require('./notifs');
const redFlags = require('./red-flags');
admin.initializeApp();

exports.user = user;
exports.stats = stats;
exports.email = email;
exports.image = image;
exports.spotify = spotify;
exports.notifs = notifs;
exports.redFlags = redFlags;
