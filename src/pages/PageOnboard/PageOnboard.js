/** @jsx jsx */

import { Component, Fragment } from 'react';
import { jsx, Button } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';

import Input from 'components/Input';
import Link from 'components/Link';
import Logo from 'components/Logo';
import Select from 'components/Select';
import { updateProfiles } from 'utils/updateProfiles';
import { Pronouns } from 'constants/Pronouns';
import PronounSelect from 'pages/PageProfile/PronounSelect.js';
import { GenderOptions } from 'constants/GenderOptions';
import ReactTooltip from 'react-tooltip';
import { DefaultPrivacy } from 'constants/GenderOptions.js';

import OnboardingGraphic from 'assets/onboarding.png';

import { pageOnboardSx } from 'pages/PageOnboard/PageOnboardStyles';

class PageOnboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      name: '',
      year: '',
      privacy: DefaultPrivacy,
      gender: { genderValue: null, optional: null },
      lookingFor: '',
      lookingForGender: { love: null, friendship: null },
      onboarded: true,
      pronouns: [],
    };
  }

  componentDidMount() {
    const { profile_pic, providerData, updateAllProfiles } = this.props;
    // If user has a provider profile pic set it as their Datamatch profile pic
    if (providerData && providerData[0].photoURL && !profile_pic) {
      const picURL = providerData[0].photoURL;
      // Replaces or sets the size parameter to 400 and centered (assuming -c centers it but not sure)
      const resizedURL =
        picURL.indexOf('=s') === -1
          ? picURL.concat('=s400-c')
          : picURL.substring(0, picURL.indexOf('=s')).concat('=s400-c');
      updateAllProfiles({ profile_pic: resizedURL });
    }
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value || null });
  };

  // handle next button clicks
  handleButtonClick = event => {
    // prevent default action associated with the event
    event.preventDefault();
    this.moveToNextInput();
  };

  // returns the first missing input that is required
  findMissing = () => {
    const {
      name,
      year,
      gender: { genderValue },
      pronouns,
      lookingFor,
    } = this.state;
    if (!name) {
      return 'name';
    } else if (!year) {
      return 'year';
    } else if (!genderValue) {
      return 'gender section';
    } else if (!pronouns) {
      return 'pronouns';
    } else if (!lookingFor) {
      return '"I\'m looking for"';
    } else if (this.missingLookingFor()) {
      return 'looking for gender';
    }
    return null;
  };

  getCollege = () => {
    const { college } = this.props;
    const { year } = this.state;

    // if college is MIT, we need to ask if user is a grad student
    // and update college manually since @mit.edu emails don't tell us this
    if (college === 'MIT' && year === 'grad') {
      // `Harvard-MIT` refers to the grad schools
      return 'Harvard-MIT';
    }
    return college;
  };

  nextStep = event => {
    event.preventDefault();
    this.setState(state => {
      return { step: state.step + 1 };
    });
  };

  // update firebase at the end of onboarding
  finishOnboarding = event => {
    event.preventDefault();

    if (this.findMissing()) {
      return;
    }

    const {
      email,
      updateAllProfiles,
      updateLandingPage,
      history,
      totalUsers,
    } = this.props;
    const { year } = this.state;
    const college = this.getCollege();

    // add landing message
    const landingMessage = {
      college,
      year,
    };

    this.setState(() => {
      // TODO: Only update things that haven't changed.
      updateLandingPage(landingMessage);
      updateAllProfiles({
        ...this.state,
        college,
        email,
        show: true,
        signupNum: totalUsers,
      });
    });

    // redirect user to /app
    history.push('/app');
  };

  // render different icon based on privacy setting
  PrivacyIcon = ({ privacy }) => {
    if (privacy === 'private') {
      return <i className="fas fa-user-shield fa-cog fa-sm"></i>;
    } else if (privacy === 'mutual') {
      return <i className="fas fa-user-friends fa-cog fa-sm"></i>;
    } else if (privacy === 'public') {
      return <i className="fas fa-globe-americas fa-cog fa-sm"></i>;
    }
    return null;
  };

  LookingForGender = ({ type, disabled }) => (
    <div className="looking-container">
      <div className="body-text">
        For {type}, I would like to be matched with
      </div>
      <p>For {type}, I would like to be matched with</p>
      <Select
        className="gender-select body-text background-border"
        disabled={disabled}
        handleInputChange={this.handleLookingForGenderChange}
        labels={GenderOptions}
        name={type}
        placeholder="gender(s)"
        value={this.state.lookingForGender[type]}
        values={GenderOptions}
      />
    </div>
  );

  renderErrors = missing => {
    return (
      <Fragment>
        {missing && (
          <div className="incomplete-message">
            Please complete before continuing. Your {missing} is incomplete.
          </div>
        )}
      </Fragment>
    );
  };

  renderForm() {
    const { name, year } = this.state;

    let missing;
    if (!name) {
      missing = 'name';
    } else if (!year) {
      missing = 'year';
    }

    return (
      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="input-container">
          <div className="profile-container">
            <div className="question-header">Name</div>
            <Input
              className="profile-input background-border"
              handleInputChange={this.handleInputChange}
              name="name"
              placeholder="Full name"
              type="text"
              value={name || ''}
            />
            <br />
            <div className="question-header">Year</div>
            <p>
              (If you are a grad student, please select "Grad Student" :)
              thanks!)
            </p>
            <Select
              className="profile-input background-border profile-select"
              handleInputChange={this.handleInputChange}
              labels={['2022', '2023', '2024', '2025', 'Grad Student']}
              name="year"
              placeholder="Year"
              value={year}
              values={['2022', '2023', '2024', '2025', 'grad']}
            />
          </div>
          {missing && (
            <div>
              <br />
              {this.renderErrors(missing)}
            </div>
          )}
          <br />
          <div className="save-button">
            <Button
              onClick={this.nextStep}
              disabled={missing}
              variant={missing ? 'disabled' : 'accent'}
            >
              Continue <i className="fas fa-arrow-right" />
            </Button>
          </div>
        </div>
        <br />
        <img alt="wii sign-ups" src={OnboardingGraphic} width={'100%'} />
      </form>
    );
  }

  handleObjectChange = attrName => event => {
    const { name, value } = event.target;
    // const { lookingFor } = this.state;
    this.setState(state => ({
      [attrName]: { ...state[attrName], [name]: value || null },
    }));
  };

  handleGenderChange = this.handleObjectChange('gender');

  handleLookingForGenderChange = this.handleObjectChange('lookingForGender');

  onPronounDelete = i => {
    const tags = this.state.pronouns.slice(0);
    tags.splice(i, 1);
    this.setState({ pronouns: tags });
  };

  // handles adding pronouns
  onPronounAddition = tag => {
    this.setState(({ pronouns }) => ({
      pronouns: [...pronouns, tag.name],
    }));
  };

  // check if we are missing anything for looking for inputs
  missingLookingFor = () => {
    const {
      lookingFor,
      lookingForGender: { friendship, love },
    } = this.state;
    return (
      !lookingFor ||
      (lookingFor === 'friendship' && !friendship) ||
      (lookingFor === 'love' && !love) ||
      (lookingFor === 'love and friendship' && !(friendship && love))
    );
  };

  // returns true if pronoun arrays from db and state are equal
  checkPronounsEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    // if state has not been updated, order of pronouns should be the same
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  renderDating() {
    const { lookingFor, pronouns, privacy } = this.state;

    const missing = this.findMissing();

    const { genderValue, optional } = this.state.gender;

    // needed for pronouns
    // don't suggest pronouns that have been selected already
    const suggestedPronouns = Pronouns.filter(
      pronoun => pronouns.indexOf(pronoun.name) === -1,
    );

    // we need to transform pronouns to have the name attribute
    const pronounObjects = pronouns.map(pronoun => ({ name: pronoun }));

    // I'm looking for
    const showLoveSelect = lookingFor.includes('love');
    const showFriendSelect = lookingFor.includes('friendship');

    return (
      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="input-container">
          <div className="profile-container">
            <div className="question-header">Dating info</div>
          </div>

          <div className="info-privacy">
            <div className="label">
              <p>
                Gender
                <span
                  data-tip={
                    'We ask for gender information in <br />\
                     order to create matches. You can <br />\
                     edit gender privacy to be private, <br />\
                     public, or visible to mutual matches.'
                  }
                >
                  <i className="fas fa-info-circle info-icon"></i>
                  <ReactTooltip place="right" multiline={true} />
                </span>
              </p>
            </div>
            <div className="privacy-layout">
              <this.PrivacyIcon privacy={privacy} />
              <Select
                className="privacy-select privacy-text"
                handleInputChange={this.handleInputChange}
                labels={[
                  'Private to me',
                  'Mutual matches',
                  'Public on profile',
                ]}
                name="privacy"
                placeholder="Select privacy"
                value={privacy}
                values={['private', 'mutual', 'public']}
              />
            </div>
          </div>

          <div className="gender-container">
            {/* Gender */}
            <div className="gender-input">
              <Select
                className="gender-select body-text background-border"
                handleInputChange={this.handleGenderChange}
                labels={['Man', 'Woman', 'Nonbinary']}
                name="genderValue"
                placeholder="Select"
                value={genderValue}
                values={['man', 'woman', 'nonbinary']}
              />
            </div>

            <div className="special-br" />

            {/* Pronouns */}
            <div className="gender-input">
              <PronounSelect
                onAddition={this.onPronounAddition}
                onDelete={this.onPronounDelete}
                overflow={pronouns.length > 3}
                placeholderText="Add pronouns"
                suggestions={suggestedPronouns}
                tags={pronounObjects}
              />
            </div>

            <div className="special-br" />

            {/* Describe gender identity */}
            <div className="gender-input">
              <Input
                className="gender-select body-text background-border"
                handleInputChange={this.handleGenderChange}
                name="optional"
                placeholder="Optional space to describe your gender identity"
                type="text"
                value={optional || ''}
              />
            </div>
          </div>
          <br />
          <br />
          {/* I'm looking for */}
          <div className="looking-container">
            <p>I'm looking for</p>
            <Select
              className="gender-select body-text background-border"
              handleInputChange={this.handleInputChange}
              labels={['love', 'friendship', 'love and friendship']}
              name="lookingFor"
              placeholder="Select"
              value={lookingFor}
              values={['love', 'friendship', 'love and friendship']}
            />
          </div>
          {showLoveSelect && <this.LookingForGender type="love" />}
          {showFriendSelect && <this.LookingForGender type="friendship" />}

          {missing && (
            <div>
              <br />
              {this.renderErrors(missing)}
            </div>
          )}
          <br />
          <div className="save-button">
            <Button onClick={this.finishOnboarding} variant={'accent'}>
              Finish onboarding <i className="fas fa-arrow-right" />
            </Button>
          </div>
        </div>
        <br />
        <img alt="wii sign-ups" src={OnboardingGraphic} width={'100%'} />
      </form>
    );
  }

  render() {
    const { step } = this.state;
    const { logoutUser } = this.props;
    const onboardingPage =
      (step === 0 && this.renderForm()) || (step === 1 && this.renderDating());

    return (
      <div className="PageOnboard" sx={pageOnboardSx}>
        <div className="header">
          <div className="logo-container">
            <Logo />
          </div>
        </div>
        {onboardingPage}
        <div className="logout-container">
          <div className="AuthLinks">
            <Link
              to={'/login'}
              fontWeight="default"
              color="text"
              onClick={logoutUser}
            >
              Logout
            </Link>
          </div>
          <br />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    firebase: { logout, push, update },
  } = props;
  const {
    auth: { email, providerData, uid },
    data: { totalUsers },
    profile: { profile_pic },
  } = state.firebase;
  return {
    email,
    logoutUser: logout,
    profile_pic,
    providerData,
    totalUsers,
    uid,
    updateAllProfiles: updateProfiles(update, uid, email),
    updateLandingPage: greeting => {
      push(`/landing`, greeting);
    },
  };
};

export default compose(
  // to get firebase update function and the user's sign up number
  firebaseConnect([{ path: '/stats/totals/users', storeAs: 'totalUsers' }]),
  // to change history with history.push
  withRouter,
  connect(mapStateToProps),
)(PageOnboard);
