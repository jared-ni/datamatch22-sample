import { profileFields } from 'constants/ProfileFields';

// Returns a function that updates the corresponding profile fields in the database given data
export const updateProfiles = (update, uid, email) => {
  return data => {
    let updates = {};
    Object.keys(profileFields).forEach(key => {
      profileFields[key].forEach(field => {
        if (field in data) {
          updates['/' + key + '/' + uid + '/' + field] = data[field];
        }
      });
    });
    // If name is changed, update email to name
    if ('name' in data) {
      const { name, show } = data;
      const lowerCaseName = name.toLowerCase();
      updates['/emailToName/' + email.replace(/\./g, ',')] = name;

      // update search index tree depending on their search privacy setting
      if (show) {
        updates[`/searchIndex/${uid}`] = {
          last: lowerCaseName.split(' ').slice(-1)[0],
          searchName: lowerCaseName,
        };
      } else {
        updates[`/searchIndex/${uid}`] = null;
      }
    }
    update('/', updates);
  };
};
