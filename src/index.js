/** @jsx jsx */

import ReactDOM from 'react-dom';
import { jsx, ThemeProvider } from 'theme-ui';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  firebaseReducer,
  ReactReduxFirebaseProvider,
} from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore';
import { composeWithDevTools } from 'redux-devtools-extension';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';

import 'bootstrap/dist/css/bootstrap.css';
import 'theme/global.css';

import { FIREBASE_CONFIG } from 'constants/Firebase';
import theme from 'theme';
import Root from 'pages/Root';

firebase.initializeApp(FIREBASE_CONFIG);

// uncomment below to activate firebase functions locally
// firebase.functions().useEmulator('localhost', 5000);

// react-redux-firebase config: http://react-redux-firebase.com/docs/api/constants.html#defaultconfig
const rrfConfig = {
  userProfile: 'smallProfile',
};

// redux reducer
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

// redux store + dev tools
const store = createStore(rootReducer, {}, composeWithDevTools());

// react-redux-firebase props (initialize react-redux-firebase provider)
const rrfProps = {
  firebase: firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

// render our application!!!
//   - redux store provider wraps around
//   - react-redux-firebase provider which wraps around
//   - react router wraps around the Root component
//   - Root component is just a huge react router Switch :)
ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Router>
        <ThemeProvider theme={theme}>
          <Root />
        </ThemeProvider>
      </Router>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root'),
);
