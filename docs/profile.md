## Profile Structure

We have created three separate profiles: small profile, public profile, and private profile. The small profile contains the bare minimum data that needs to be consistently updated. The public profile contains profile data which can be read by any user. The private profile contains data which is only available to the user.

### Accessing profiles

To access these three profiles, they are under `smallProfile/`, `publicProfile/`, and `privateProfile/` in the realtime database. The small profile will always be available under `state.firebase.profile` in the Redux store, but you will need to fetch the public and private profile data explicitly from Firebase.

Example of fetching public/private profile from Firebase given uid as a prop to the component:

```js
firebaseConnect(props => [
  {
    path: '/publicProfile/' + props.uid,
    storeAs: 'publicProfile',
  },
  {
    path: '/privateProfile/' + props.uid,
    storeAs: 'privateProfile',
  },
]),
```

A more detailed example is the PageProfile component.

### Updating profiles

To update specific fields in the profiles, we have a function called `updateProfiles` in the `utils` folder which takes as input: the Firebase Realtime Database update function (a prop introduced via `firebaseConnect`), and the uid and email of the user we're updating the profiles of. `updateProfiles` returns a function that takes in new profile data and updates Firebase Realtime Database with the new data under the corresponding profiles.

Here is an example of using `updateProfiles`.

```js
const mapStateToProps = (state, props) => {
  const { email, uid } = state.firebase.auth;
  return {
    updateAllProfiles: updateProfiles(props.firebase.update, uid, email),
  };
};
```

Here, `updateAllProfiles` is the returned function that will take in data. Note that to be able to use `props.firebase.update`, you must use `firebaseConnect`.

Then we can use `updateAllProfiles` like this:

```js
// This function call will only update description, name, and tiktok handle.
updateAllProfiles({
  description: 'Hi there!',
  name: 'Jon',
  tiktok: 'asdf',
});
```

Note that the returned function (`updateAllProfiles`) handles identifying which field goes to which profile for you by following the `profileFields` constant under the `constants/ProfileFields.js` file. This allows you to update multiple profiles all at once with a single function call.

### Adding fields to profiles

To add a new field to the profile, you can add it to the array under each profile that needs it in the `constants/ProfileFields.js` file.

If the private profile looked like this:

```js
privateProfile: [
  'email',
  'gender',
  'lookingFor',
  'lookingForGender',
  'matchType',
  'show',
],
```

and we wanted to add a new field called `secretField`, we can just add it to the array:

```js
privateProfile: [
  'email',
  'gender',
  'lookingFor',
  'lookingForGender',
  'matchType',
  'secretField',
  'show',
],
```

Note that we can add the same field to multiple profiles if needed. For example, we have `college` in both the small profile and public profile:

```js
smallProfile: ['college', 'name', 'onboarded', 'profile_pic'],
publicProfile: [
  'college',
  ...
],
```

Removing fields or moving a field from one profile to another profile will not automatically move those fields in the Firebase Realtime Database. You will have to do the data movement manually.
