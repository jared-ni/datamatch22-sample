import React, { Fragment, useEffect, useState } from 'react';
import { Button } from 'theme-ui';
import queryString from 'query-string';

import SpotifyDisplay from 'components/SpotifyDisplay';

import { Mixpanel } from 'utils/mixpanel.js';

const spotifySx = {
  '.question-subheader': {
    fontSize: '12px',
    letterSpacing: '0.05em',
    marginBottom: '1em',
  },

  '.spotify-container': {
    marginBottom: '10px',
  },
};

export function Spotify({ props, window, saveProfile, missing }) {
  // Extract fields from props
  const {
    uid,
    location,
    profile,
    updateNotifications,
    updateAllProfiles,
  } = props;

  // Declare new state variable with state hook
  // to update `spotifyLoading`, use `setSpotifyLoading(value)`,
  // where `value` is `true` or `false`
  const [spotifyLoading, setSpotifyLoading] = useState(false);

  useEffect(() => {
    // Check if user just returned from authorizing Spotify
    const { code, state } = queryString.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    // State provides protection against attacks such as cross-site request forgery.
    // See https://tools.ietf.org/html/rfc6749#section-10.12
    if (code && state === encodeURIComponent(uid)) {
      // Disables spotify button to prevent repeated clicks while data is loading
      setSpotifyLoading(true);
      // Call Spotify cloud function to get Spotify user info. Function needs
      // the auth token (from current url) and same redirect URI used to get
      // auth token (address of this page) for subsequent Spotify API calls.
      props.firebase
        .functions()
        .httpsCallable('spotify-spotifyConnect')({
          authToken: code,
          redirect_uri: window.location.origin + window.location.pathname,
        })
        .then(error => {
          // Checks if spotify was successfully added before logging event
          if (!error.data) {
            // Web analytics
            Mixpanel.track('Spotify_Added', {});
          }
          setSpotifyLoading(false);
        });
    }
  }, [
    uid,
    location.search,
    window.location.origin,
    window.location.pathname,
    props.firebase,
  ]);

  return (
    <div sx={spotifySx}>
      <div className="question-subheader">
        Share your exquisite musical taste with others by connecting to Spotify.
        Your top artists will be made public on your profile.
      </div>
      {profile.spotifyRefreshToken ? (
        <div>
          <div className="spotify-container">
            <SpotifyDisplay
              isProfilePage={true}
              objects={profile.spotifyTopArtists}
            />
          </div>
          <Button
            onClick={() => {
              // Web analytics
              Mixpanel.track('Spotify_Removed', {});
              updateNotifications({ spotify: null });
              updateAllProfiles({
                spotifyRefreshToken: null,
                spotifyTopArtists: null,
                spotifyUserLink: null,
              });
            }}
          >
            <i className="fab fa-spotify" /> Disconnect from Spotify
          </Button>
        </div>
      ) : (
        <div>
          <Button
            disabled={spotifyLoading || missing}
            onClick={() => {
              saveProfile(false);
              window.location.href =
                'https://accounts.spotify.com/authorize?' +
                'client_id=dd3848a5d5704368bac9db51b5d528f8&' +
                'response_type=code&' +
                'scope=user-top-read&' +
                `state=${encodeURIComponent(uid)}&` +
                'redirect_uri=' +
                encodeURIComponent(
                  window.location.origin + window.location.pathname,
                );
            }}
            variant={spotifyLoading || missing ? 'disabled' : 'primary'}
          >
            <i className="fab fa-spotify" /> Connect to Spotify
          </Button>
          <Fragment>
            {missing && (
              <div className="incomplete-message" style={{ fontSize: 15 }}>
                Fully complete your profile before connecting to Spotify. Your{' '}
                {missing} is incomplete.
              </div>
            )}
          </Fragment>
        </div>
      )}
    </div>
  );
}
