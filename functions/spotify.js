const admin = require('firebase-admin');
const fetch = require('node-fetch');
const functions = require('firebase-functions');
const utils = require('./utils');

const client_id = 'dd3848a5d5704368bac9db51b5d528f8';
const client_secret = 'a84028d74941402e9c4c688f8c9633ef';

const NUM_ARTISTS = 2;

exports.spotifyConnect = functions.https.onCall(
  async ({ authToken, redirect_uri }, context) => {
    if (!utils.isLoggedIn(context)) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'spotifyConnect must be called while authenticated.',
      );
    }
    try {
      const tokenRequest = {
        client_id,
        client_secret,
        code: authToken,
        grant_type: 'authorization_code',
        redirect_uri,
      };

      // Spotify API 1st call using authentication token to get access token
      // The body of this POST request must contain the parameters encoded in
      // application/x-www-form-urlencoded as defined in the Spotify API.
      // See https://developer.spotify.com/documentation/general/guides/authorization-guide
      const { access_token, refresh_token } = await (
        await fetch('https://accounts.spotify.com/api/token', {
          body: encodeBody(tokenRequest),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          method: 'post',
        })
      ).json();

      // API call to get link to user's Spotify profile
      const { external_urls } = await (
        await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: 'Bearer ' + access_token,
          },
          method: 'get',
        })
      ).json();

      // API call to get user's top artists
      const artists = (
        await (
          await fetch(
            'https://api.spotify.com/v1/me/top/artists?limit=' + NUM_ARTISTS,
            {
              headers: {
                Authorization: 'Bearer ' + access_token,
              },
              method: 'get',
            },
          )
        ).json()
      ).items.map(item => ({
        image: item.images[0].url,
        link: item.external_urls.spotify,
        name: item.name,
      }));

      // Update the user's profile with their spotify data
      let updates = {};
      updates[
        `privateProfile/${context.auth.uid}/spotifyRefreshToken`
      ] = refresh_token;
      updates[`/notifs/${context.auth.uid}/pre/spotify`] = true;
      updates[`publicProfile/${context.auth.uid}/spotifyTopArtists`] = artists;
      updates[`publicProfile/${context.auth.uid}/spotifyUserLink`] =
        external_urls.spotify;

      await admin.database().ref().update(updates);
    } catch (error) {
      return error;
    }
  },
);

const encodeBody = jsonObj => {
  let body = [];
  Object.keys(jsonObj).forEach(property => {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(jsonObj[property]);
    body.push(encodedKey + '=' + encodedValue);
  });
  return body.join('&');
};
