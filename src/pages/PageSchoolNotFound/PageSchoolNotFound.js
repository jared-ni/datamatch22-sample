import React from 'react';
import { firebaseConnect } from 'react-redux-firebase';

import Feedback from 'pages/PageSchoolNotFound/Feedback';

const PageSchoolNotFound = ({ email, firebase }) => {
  const isCMU = email.split('@')[1] === 'cmu.edu';
  if (isCMU) {
    return (
      <div
        style={{
          background: 'white',
          padding: 20,
          maxWidth: 500,
          margin: '10% auto',
        }}
      >
        Please register with your @andrew.cmu.edu email!
        <br />
        <div
          onClick={firebase.logout}
          style={{
            background: 'none',
            fontSize: 16,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          Logout
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        background: 'white',
        padding: 20,
        maxWidth: 500,
        margin: '10% auto',
      }}
    >
      Sorry, you need to sign up with a .edu email corresponding to a registered
      school! :(
      <div style={{ height: 20 }} />
      <div>
        If you want to bring Datamatch to your campus, reach out to us below!
      </div>
      <br />
      <Feedback
        buttonText="Send!"
        email={email}
        name="Interest from another College"
        placeholder="Send us a message!"
        submittedText="We'll get back ASAP!"
      />
      <br />
      <div
        onClick={firebase.logout}
        style={{
          background: 'none',
          fontSize: 16,
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        Logout
      </div>
    </div>
  );
};

export default firebaseConnect()(PageSchoolNotFound);
