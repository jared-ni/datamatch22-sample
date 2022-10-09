import { isLoaded } from 'react-redux-firebase';

// Returns the matchId given uid1 and uid2
export const getMatchId = (uid1, uid2) =>
  uid1 < uid2 ? `${uid1}-${uid2}` : `${uid2}-${uid1}`;

// Returns a function that creates a one-directional match between uid and otherUid
export const makeMatch = (update, uid) => {
  return async (otherUid, hasMatched) => {
    // don't try to match if you have already matched
    if (hasMatched) {
      return;
    }

    // Prevent people from matching themselves
    if (uid === otherUid) {
      alert("you can't match yourself! we respect the self love tho");
      return;
    }

    // Update matchCatalog/uid/otherUid to true
    // we need to update this separately, so the database doesn't undo a optimisitc write
    update(`/matchCatalog/${uid}/${otherUid}`, { matched: true });

    // special case, we know that the match already exists
    if (hasMatched === false) {
      return;
    }

    try {
      // new match object
      const matchId = getMatchId(uid, otherUid);
      await update(`/matches/${matchId}`, { searchMatch: true });
    } catch (err) {
      // If error updating matches, this means the match object already exists
      console.log(err);
    }
  };
};

// here we are pulling the actual match objects from /matches/matchId
// based on the ids given from our matchCatalog.
// the order of the matchId is uid1-uid2 if uid1 < uid2 lexicographically
export const fetchMatchObjects = (catalog, uid) => {
  if (!catalog) {
    return null;
  }

  // catalog = matchCatalog here
  return Object.keys(catalog).flatMap(otherUid => {
    const matchId = getMatchId(uid, otherUid);
    const { matched } = catalog[otherUid];

    // can only check if the other person matched back if you matched them
    // note: matchStatus is not cleared out if you unmatch (which currently isn't allowed).
    // thus, the status display uses both matchStatus and hasMatched to make this update.
    const matchStatus = matched
      ? [
          {
            path: `/matchCatalog/${otherUid}/${uid}/matched`,
            storeAs: `/matchStatuses/${otherUid}`,
          },
        ]
      : [];

    return [
      // as well as the match's public profiles
      {
        path: `/publicProfile/${otherUid}`,
        storeAs: `/profiles/${otherUid}`,
      },
      // we pull this user's match object
      { path: `/matches/${matchId}`, storeAs: `/matches/${otherUid}` },
      ...matchStatus,
    ];
  });
};

export const allMatchesAndProfilesLoaded = ({ catalog, matches, profiles }) => {
  // are there any set matches by the algorithm OR mutual search matches?
  const setMatches = Object.keys(catalog).filter(
    uid => catalog[uid].matched === true || catalog[uid].matched === false,
  );
  // for every SET match, we check if the match is loaded (invariant: every match in our catalog has a match object)
  const allMatchesLoaded = setMatches.every(
    uid => matches && isLoaded(matches[uid]),
  );
  // for every uid in the catalog, it's either null or the actual profile, so just check everything
  const allProfilesLoaded = Object.keys(catalog).every(
    uid => profiles && isLoaded(profiles[uid]),
  );

  return allProfilesLoaded && allMatchesLoaded;
};
