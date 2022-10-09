/** @jsx jsx */

import { Component, Fragment } from 'react';
import { jsx, Button } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Autosuggest from 'react-autosuggest';

import { pageProfileSx, profileModalSx } from './PageProfileStyles';
import { Outtakes } from './Outtakes';
import { Spotify } from './Spotify';
import Checkboxes from './Checkboxes';
import Container from 'components/Container';
import Header from 'components/Header';
import Input from 'components/Input';
import Loading from 'components/Loading';
import PicUpload from 'components/PicUpload';
import PronounSelect from './PronounSelect';
import Select from 'components/Select';
import Textarea from 'components/Textarea';

import {
  getPartnerSchool,
  hasCrossSchoolMatches,
} from 'constants/CrossSchoolMatches.js';
import { DefaultPrivacy } from 'constants/GenderOptions.js';
import { GenderOptions } from 'constants/GenderOptions';
import { Prompts, SchoolPrompts } from 'constants/Prompts';
import { Pronouns } from 'constants/Pronouns';
import { USTerritoryList, CountryList } from 'constants/Countries';

import { Mixpanel } from 'utils/mixpanel.js';
import { updateProfiles } from 'utils/updateProfiles';

const offCampus = 'off-campus';
const onCampus = 'on-campus';
const mandatoryStateSelect = 'United States of America';

class PageProfile extends Component {
  state = {
    // true if profile has been already
    // loaded from database and into the state
    loaded: false,
    promptQuestions: Prompts.slice(),
  };

  componentDidMount() {
    // call handleClickOutside when mouse pointer is clicked
    // TODO: Need better way to handle autosave than mouse up
    document.addEventListener('mouseup', this.handleClickOutside);
    // Web analytics
    Mixpanel.track('Profile_Page', {});

    // Append school-specific prompt, if any, to end of promptQuestions[0]
    const schoolPrompt = SchoolPrompts[this.props.college];
    if (schoolPrompt && this.state.promptQuestions[0].length < 6) {
      const promptQuestionsCopy = this.state.promptQuestions.slice();
      promptQuestionsCopy[0] = promptQuestionsCopy[0].concat(schoolPrompt);
      this.setState({ promptQuestions: promptQuestionsCopy });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleClickOutside);
  }

  componentDidUpdate() {
    const { privateProfile, profile, publicProfile } = this.props;
    // if private and public profile is loaded for the first time, update the state
    if (isLoaded(privateProfile, publicProfile) && !this.state.loaded) {
      const {
        description = null,
        dorm = null,
        gender = { genderValue: null, optional: null },
        location = { campusLocation: null, country: null, state: null },
        lookingFor = '',
        lookingForGender = { love: null, friendship: null },
        name = null,
        privacy = DefaultPrivacy,
        prompt: prompts = [
          { id: 0, answer: null },
          { id: 0, answer: null },
          { id: 0, answer: null },
        ],
        pronouns = [],
        show = true,
        facebook = null,
        instagram = null,
        snapchat = null,
        tiktok = null,
        year = null,
      } = profile;

      this.setState({
        crossMatch: { yes: !!profile.crossMatch },
        description,
        dorm,
        countrySuggestions: CountryList,
        gender,
        location,
        lookingFor,
        lookingForGender,
        name,
        noDormMatch: { yes: !!profile.noDormMatch },
        privacy,
        prompts,
        pronouns,
        show,
        showModal: false,
        stateSuggestions: USTerritoryList,
        facebook,
        instagram,
        snapchat,
        tiktok,
        year,
        loaded: true,
      });
    }
  }

  handleCheckboxChange = (name, response) => {
    const values = this.state[name];
    const bool = values ? !values[response] : true;
    const newValues = {
      ...values,
      [response]: bool,
    };
    this.setState({ [name]: newValues });
  };

  // handle mouse clicks (saves the profile)
  handleClickOutside = () => {
    // save profile silently when user clicks outside inputs
    // (without displaying modal)
    this.saveProfile(false);
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value || null });
  };

  // handle changes to the prompt Q&A
  handlePromptAnswerChange = (event, index) => {
    const { value } = event.target;
    this.setState(({ prompts }) => {
      const newPrompts = prompts.slice();
      newPrompts[index] = { ...prompts[index], answer: value || null };
      return { prompts: newPrompts };
    });
  };

  // handle changes to location questions
  handleLocationChange = e => {
    const { name, value } = e.target;
    // if on campus, delete country/state info
    if (name === 'campusLocation' && value === onCampus) {
      this.setState(({ location }) => ({
        location: { ...location, country: null, state: null, [name]: value },
      }));
    } else {
      // if off campus, delete dorm info and add country/state info if necessary
      this.setState(({ location }) => ({
        dorm: null,
        location: {
          ...location,
          [name]: value,
          country: location.country || '',
          state: location.state || '',
        },
      }));
    }
  };

  // handles changes to country/state autosuggest
  handleLocationSelect = (_e, newValue, type) => {
    const { location } = this.state;
    if (type === 'country') {
      this.setState({
        location: {
          ...location,
          country: newValue,
          state: newValue === mandatoryStateSelect ? '' : null,
        },
      });
    } else if (type === 'state' && location.country === mandatoryStateSelect) {
      this.setState({ location: { ...location, state: newValue } });
    }
  };

  // reset location if invalid, called onBlur (when input loses focus)
  handleLocationReset = e => {
    const { name } = e.target;
    const { location } = this.state;

    // don't reset if valid name
    if (
      CountryList.includes(location[name]) ||
      USTerritoryList.includes(location[name])
    ) {
      return;
    }

    this.setState(({ location }) => ({
      location: { ...location, [name]: '' },
    }));
  };

  // teach Autosugest how to calculate suggestions for any input value
  // reference for all Autosuggest-related code: https://github.com/moroshko/react-autosuggest#on-suggestions-clear-requested-prop-note
  getSuggestions = (value, name) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const list = name === 'countrySuggestions' ? CountryList : USTerritoryList;
    return inputLength === 0
      ? []
      : list.filter(
          location =>
            location.toLowerCase().slice(0, inputLength) === inputValue,
        );
  };

  // handles instances in which you want to update suggestions
  onSuggestionsFetchRequested = (value, name) => {
    this.setState({ [name]: this.getSuggestions(value, name) });
  };

  // handle instances in which you want to clear suggestions
  onSuggestionsClearRequested = name => {
    this.setState({ [name]: [] });
  };

  getSuggestionValue = suggestion => suggestion;

  renderSuggestion = suggestion => <div>{suggestion}</div>;

  // handle changes to toggle buttons
  handleToggleChange = () => {
    this.setState({ show: !this.state.show });
  };

  // handle changes to nested objects in profile
  handleObjectChange = attrName => event => {
    const { name, value } = event.target;
    // const { lookingFor } = this.state;
    this.setState(state => ({
      [attrName]: { ...state[attrName], [name]: value || null },
    }));
  };

  handleGenderChange = this.handleObjectChange('gender');
  handleLookingForGenderChange = this.handleObjectChange('lookingForGender');

  // handles deleting pronouns
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

  // returns the first missing input that is required
  findMissing = () => {
    const {
      dorm,
      gender: { genderValue },
      location: { campusLocation, country, state },
      lookingFor,
      name,
      privacy,
      year,
    } = this.state;

    if (
      this.props.status === 'live-matches' ||
      this.props.status === 'live-processing'
    ) {
      return null;
    } else if (!name) {
      return 'name';
    } else if (!year) {
      return 'year';
    } else if (!genderValue) {
      return 'gender section';
    } else if (!privacy) {
      return 'gender privacy';
    } else if (!lookingFor) {
      return '"I\'m looking for"';
    } else if (this.missingLookingFor()) {
      return 'looking for gender';
    } else if (!campusLocation) {
      return 'campus location';
    } else if (campusLocation === 'on-campus' && !dorm) {
      return 'affiliation';
    } else if (
      campusLocation === 'off-campus' &&
      !CountryList.includes(country)
    ) {
      return 'country location';
    } else if (
      campusLocation === 'off-campus' &&
      country === mandatoryStateSelect &&
      !USTerritoryList.includes(state)
    ) {
      return 'state location';
    } else if (!this.props.profile_pic) {
      return 'profile picture';
    }
    return null;
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

  // returns true if input has changed from previous save
  checkChanged = () => {
    const { profile } = this.props;

    // can only be STRING/integer inputs
    const needCheck = [
      'name',
      'year',
      'dorm',
      'description',
      'lookingFor',
      'privacy',
      'facebook',
      'instagram',
      'snapchat',
      'tiktok',
    ];

    // b/c description is optional, this.state.description could be null
    const different = needCheck.some(
      input => (this.state[input] || '') !== (profile[input] || ''),
    );

    if (different) {
      return true;
    }

    const {
      crossMatch,
      noDormMatch,
      location,
      gender,
      prompts,
      pronouns,
      lookingForGender,
      show,
    } = this.state;

    const { campusLocation = '', country = '', state = '' } =
      profile.location || {};
    if (
      campusLocation !== (location.campusLocation || '') ||
      country !== (location.country || '') ||
      state !== (location.state || '')
    ) {
      return true;
    }

    if (show !== profile.show) {
      return true;
    }

    if (
      crossMatch.yes !== !!profile.crossMatch ||
      noDormMatch.yes !== !!profile.noDormMatch
    ) {
      return true;
    }

    const { genderValue = '', optional = '' } = profile.gender || {};
    if (
      genderValue !== (gender.genderValue || '') ||
      optional !== (gender.optional || '')
    ) {
      return true;
    }

    const pronounsDB = profile.pronouns || [];
    if (!this.checkPronounsEqual(pronounsDB, pronouns)) {
      return true;
    }

    const { friendship = '', love = '' } = profile.lookingForGender || {};
    if (
      friendship !== (lookingForGender.friendship || '') ||
      love !== (lookingForGender.love || '')
    ) {
      return true;
    }

    let promptDifferent = false;
    for (const i in prompts) {
      const { id, answer = null } = (profile.prompt || {})[i] || {};
      // if the answer was empty before and it is still empty, we don't care about this change
      if (!answer && !prompts[i].answer) {
        continue;
      }

      // otherwise, check if answer/question changed in a meaningful way
      promptDifferent =
        promptDifferent || answer !== prompts[i].answer || id !== prompts[i].id;
    }
    return promptDifferent;
  };

  // returns true if all prompt answers are empty
  checkPromptsEmpty = prompts => {
    return prompts.reduce((isEmpty, prompt) => {
      return !prompt.answer && isEmpty;
    }, true);
  };

  // save profile
  saveProfile = (showModal = true) => {
    // they click the save button, even though they didn't change anything
    if (!this.findMissing() && !this.checkChanged()) {
      showModal && this.setState({ showModal: true });
    }

    if (!this.findMissing() && this.checkChanged()) {
      const { updateAllProfiles, updateNotifications } = this.props;
      const {
        crossMatch,
        noDormMatch,
        description,
        lookingFor,
        lookingForGender,
        prompts,
      } = this.state;

      const trimmedPrompts = prompts.slice();
      for (const i in trimmedPrompts) {
        trimmedPrompts[i].answer =
          (prompts[i].answer || null) && (prompts[i].answer.trim() || null);
      }

      // structure to keep track of notifications
      // we only allow save if required fields are done, so set profile to true
      const bioNotifs = {
        bio: description ? true : null,
        profile: true,
      };

      updateNotifications(bioNotifs);

      this.setState(
        {
          // only keep the genders corresponding to the relationship status
          lookingForGender: {
            ...lookingForGender,
            friendship:
              lookingFor === 'love' ? null : lookingForGender.friendship,
            love: lookingFor === 'friendship' ? null : lookingForGender.love,
          },
        },
        () => {
          // TODO: Only update things that haven't changed.
          updateAllProfiles({
            ...this.state,
            crossMatch: crossMatch.yes || null,
            noDormMatch: noDormMatch.yes || null,
            showModal: null,
            prompt: this.checkPromptsEmpty(trimmedPrompts)
              ? null
              : trimmedPrompts,
          });
        },
      );

      // Web analytics - potentially will remove to prevent too many events being logged
      // Mixpanel.track('Profile_updated', {});
      showModal && this.setState({ showModal: true });
    }
  };

  shufflePrompts = () => {
    this.setState(({ prompts }) => {
      let newPrompts = prompts.slice();
      for (const i in prompts) {
        const oldPrompt = prompts[i];
        // they answered the question, so we don't shuffle that prompt
        if (oldPrompt.answer && oldPrompt.answer.trim()) {
          continue;
        }
        // ensure a different prompt each time they shuffle
        let newId = Math.floor(
          Math.random() * (this.state.promptQuestions[i].length - 1),
        );
        if (newId >= oldPrompt.id) {
          newId++;
        }

        newPrompts[i] = {
          id: newId,
        };
      }
      return { prompts: newPrompts };
    });
  };

  TestItOut = ({ url, username }) => (
    <a href={`${url}${username}`} rel="noopener noreferrer" target="_blank">
      <i
        className="fas fa-angle-right"
        data-toggle="tooltip"
        style={{ cursor: 'pointer' }}
        title="Test it out!"
      ></i>
    </a>
  );

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

  // renders looking for gender sections
  LookingForGender = ({ type, disabled }) => (
    <div className="looking-container">
      <div className="body-text">
        For {type}, I would like to be matched with
      </div>
      <Select
        className="looking-select body-text background-border"
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

  renderErrors = (missing, changed) => {
    const surveyClosed =
      this.props.status === 'live-matches' ||
      this.props.status === 'live-processing';
    return (
      <Fragment>
        {missing && (
          <div className="incomplete-message">
            Please fully complete profile before saving. Your {missing} is
            incomplete.
          </div>
        )}
        {changed && (
          <div className="incomplete-message">You have unsaved changes.</div>
        )}
        {!missing && !changed && !surveyClosed && (
          <div className="complete-message">
            All required profile fields complete! Don't stop now! Studies have
            shown more detailed profiles tend to get more matches...
          </div>
        )}
        {!missing && !changed && surveyClosed && (
          <div className="complete-message">
            Thanks for filling out your profile!
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    const {
      college,
      dorms,
      profile_pic,
      status,
      uid,
      updateAllProfiles,
    } = this.props;
    const { loaded } = this.state;

    if (!loaded) {
      return <Loading />;
    }

    const {
      description,
      dorm,
      gender: { genderValue, optional },
      location: { campusLocation, country, state },
      lookingFor,
      name,
      privacy,
      prompts,
      pronouns,
      show,
      showModal,
      facebook,
      instagram,
      snapchat,
      tiktok,
      year,
    } = this.state;

    const missing = this.findMissing();
    const changed = this.checkChanged();

    // conditional rendering
    const showStateSelect = country === mandatoryStateSelect;
    const showCountrySelect = campusLocation === offCampus;
    const showDormSelect = campusLocation === onCampus;
    const showLoveSelect = lookingFor.includes('love');
    const showFriendSelect = lookingFor.includes('friendship');

    // don't suggest pronouns that have been selected already
    const suggestedPronouns = Pronouns.filter(
      pronoun => pronouns.indexOf(pronoun.name) === -1,
    );

    // we need to transform pronouns to have the name attribute
    const pronounObjects = pronouns.map(pronoun => ({ name: pronoun }));

    // After survey closes, becomes true disabling certain profile elements from being changed
    const disableProfileElements =
      status === 'live-processing' || status === 'live-matches';

    // pass props to input for autosuggest country
    const inputPropsCountry = {
      disabled: disableProfileElements,
      name: 'country',
      onBlur: e => this.handleLocationReset(e),
      onChange: (e, { newValue }) =>
        this.handleLocationSelect(e, newValue, 'country'),
      placeholder: 'Type Country',
      value: country,
      autoComplete: 'none',
    };

    const inputPropsState = {
      disabled: disableProfileElements,
      name: 'state',
      onBlur: e => this.handleLocationReset(e),
      onChange: (e, { newValue }) =>
        this.handleLocationSelect(e, newValue, 'state'),
      placeholder: 'Type State',
      value: state,
      autoComplete: 'none',
    };

    return (
      <div className="PageProfile" sx={pageProfileSx}>
        <Header>Profile</Header>
        In order to receive matches, you must complete your profile.
        <br />
        {this.renderErrors(missing, changed)}
        <div className="profile-container">
          <div className="question-header">
            The Basics{' '}
            {this.props.publicProfile.verified && (
              <img
                alt="tick"
                src={require('assets/verified-check.svg').default}
                width="20"
                height="20"
              />
            )}
          </div>
          <div className="profile-pic">
            <PicUpload
              name={uid}
              original_pic={profile_pic}
              path="/profile_pics"
              size={179}
              updateURL={updateAllProfiles}
              missing={missing}
              updateNotifs
            />
          </div>
          <Input
            className="profile-input background-border"
            handleInputChange={this.handleInputChange}
            name="name"
            placeholder="Full name"
            type="text"
            value={name}
          />
          <Select
            className="profile-input background-border profile-select"
            disabled={disableProfileElements}
            handleInputChange={this.handleInputChange}
            labels={['2022', '2023', '2024', '2025', 'Grad Student', 'Alumni']}
            name="year"
            placeholder="Year"
            value={year || ''}
            values={['2022', '2023', '2024', '2025', 'grad', 'alumni']}
          />
          <div className="text-area-container">
            <Textarea
              className="profile-text-area background-border"
              handleInputChange={this.handleInputChange}
              name="description"
              placeholder="Bio"
              rows={3}
              type="text"
              value={description || ''}
            />
          </div>
          <div className="bottom-elements">
            <div className="question-header">The Dating App Stuff</div>
            <div className="info-privacy">
              <div className="label">
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
              <div className="gender-input">
                <Select
                  className="gender-select body-text background-border"
                  disabled={disableProfileElements}
                  handleInputChange={this.handleGenderChange}
                  labels={['Man', 'Woman', 'Nonbinary']}
                  name="genderValue"
                  placeholder="Select"
                  value={genderValue}
                  values={['man', 'woman', 'nonbinary']}
                />
              </div>
              <div className="gender-input">
                <Input
                  className="optional-input body-text background-border"
                  handleInputChange={this.handleGenderChange}
                  name="optional"
                  placeholder="Optional space to describe your gender identity"
                  type="text"
                  value={optional || ''}
                />
              </div>
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
            </div>
            <br />
            <div className="looking-container">
              <div className="body-text">I'm looking for</div>
              <Select
                className="looking-select body-text background-border"
                disabled={disableProfileElements}
                handleInputChange={this.handleInputChange}
                labels={['love', 'friendship', 'love and friendship']}
                name="lookingFor"
                placeholder="Select"
                value={lookingFor}
                values={['love', 'friendship', 'love and friendship']}
              />
            </div>
            {showLoveSelect && (
              <this.LookingForGender
                type="love"
                disabled={disableProfileElements}
              />
            )}
            {showFriendSelect && (
              <this.LookingForGender
                type="friendship"
                disabled={disableProfileElements}
              />
            )}
          </div>
          <div className="botton-elements">
            <div className="question-header">The Dates</div>
            <div className="location-container body-text">
              I'm located
              <Select
                className="background-border body-text location-select campus-select"
                disabled={disableProfileElements}
                handleInputChange={this.handleLocationChange}
                labels={['on/near campus', 'off campus']}
                name="campusLocation"
                placeholder="Select"
                value={campusLocation}
                values={['on-campus', 'off-campus']}
              />
              {(showDormSelect || showCountrySelect || showStateSelect) && 'in'}
              {showDormSelect && (
                <Select
                  className="location-select background-border body-text"
                  disabled={disableProfileElements}
                  handleInputChange={this.handleInputChange}
                  labels={dorms}
                  name="dorm"
                  placeholder="Select"
                  value={dorm}
                  values={dorms}
                />
              )}
              {showCountrySelect && (
                <div className="country-smaller">
                  <Autosuggest
                    getSuggestionValue={this.getSuggestionValue}
                    id="country"
                    inputProps={inputPropsCountry}
                    onSuggestionsClearRequested={() =>
                      this.onSuggestionsClearRequested('countrySuggestions')
                    }
                    onSuggestionsFetchRequested={({ value }) =>
                      this.onSuggestionsFetchRequested(
                        value,
                        'countrySuggestions',
                      )
                    }
                    renderSuggestion={this.renderSuggestion}
                    suggestions={this.state.countrySuggestions}
                  />
                </div>
              )}
              {showStateSelect && (
                <Fragment>
                  in
                  <Autosuggest
                    getSuggestionValue={this.getSuggestionValue}
                    id="state"
                    inputProps={inputPropsState}
                    onSuggestionsClearRequested={() =>
                      this.onSuggestionsClearRequested('stateSuggestions')
                    }
                    onSuggestionsFetchRequested={({ value }) =>
                      this.onSuggestionsFetchRequested(
                        value,
                        'stateSuggestions',
                      )
                    }
                    renderSuggestion={this.renderSuggestion}
                    suggestions={this.state.stateSuggestions}
                  />
                </Fragment>
              )}
            </div>
            <div className="checkboxes body-text">
              {hasCrossSchoolMatches(college) && (
                <div>
                  <Checkboxes
                    disabled={disableProfileElements}
                    handleClick={this.handleCheckboxChange}
                    labels={['I want to opt in to cross matches!']}
                    crossMatchSchools={getPartnerSchool(college)}
                    name="crossMatch"
                    responses={['yes']}
                    values={this.state.crossMatch}
                  />
                  <br />
                </div>
              )}
              {showDormSelect && this.state.dorm && (
                <Checkboxes
                  disabled={disableProfileElements}
                  handleClick={this.handleCheckboxChange}
                  labels={[`Don’t match me with people in ${this.state.dorm}`]}
                  name="noDormMatch"
                  responses={['yes']}
                  values={this.state.noDormMatch}
                />
              )}
            </div>
          </div>
          <div className="bottom-elements">
            <div className="question-header">Social Media</div>
            <div className="question-subheader">
              Make that online connection outside of just Zoom! You can use the
              arrows to test your social links. (These will be made public on
              your profile.)
            </div>
            <div className="social-grid">
              <div className="social-container">
                <i className="fab fa-instagram fa-lg" />
                <Input
                  className="social-input background-border"
                  handleInputChange={this.handleInputChange}
                  name="instagram"
                  placeholder="handle"
                  type="text"
                  value={instagram || ''}
                />
                <this.TestItOut
                  url="https://www.instagram.com/"
                  username={instagram || ''}
                />
              </div>
              <div className="social-container">
                <i className="fab fa-snapchat fa-lg" />
                <Input
                  className="social-input background-border"
                  handleInputChange={this.handleInputChange}
                  name="snapchat"
                  placeholder="username"
                  type="text"
                  value={snapchat || ''}
                />
                <this.TestItOut
                  url="https://www.snapchat.com/add/"
                  username={snapchat || ''}
                />
              </div>
              <div className="social-container">
                <i className="fab fa-tiktok fa-lg" />
                <Input
                  className="social-input background-border"
                  handleInputChange={this.handleInputChange}
                  name="tiktok"
                  placeholder="handle"
                  type="text"
                  value={tiktok || ''}
                />
                <this.TestItOut
                  url="https://www.tiktok.com/@"
                  username={tiktok || ''}
                />
              </div>
              <div className="social-container">
                <i className="fab fa-facebook fa-lg" />
                <Input
                  className="social-input background-border"
                  handleInputChange={this.handleInputChange}
                  name="facebook"
                  placeholder="username"
                  type="text"
                  value={facebook || ''}
                />
                <this.TestItOut
                  url="https://www.facebook.com/"
                  username={facebook || ''}
                />
              </div>
            </div>
            <br />
            <Spotify
              props={this.props}
              window={window}
              saveProfile={this.saveProfile}
              missing={missing}
            />
          </div>
          <Outtakes
            promptQuestions={this.state.promptQuestions}
            prompts={prompts}
            shufflePrompts={this.shufflePrompts}
            handlePromptAnswerChange={this.handlePromptAnswerChange}
          />
          <div className="bottom-elements">
            <div className="question-header">Show Profile in Search</div>
            <Toggle defaultChecked={show} onChange={this.handleToggleChange} />
          </div>
          <Modal
            onHide={() => this.setState({ showModal: false })}
            show={showModal}
            sx={profileModalSx}
          >
            <Modal.Body className="modal-container">
              <div
                className="modal-cancel"
                onClick={() => this.setState({ showModal: false })}
              >
                Changes saved!
              </div>
            </Modal.Body>
          </Modal>
          <div className="save-button">
            <Button
              onClick={this.saveProfile}
              disabled={missing}
              variant={missing ? 'disabled' : 'primary'}
            >
              Save Changes
            </Button>
          </div>
          {this.renderErrors(missing, changed)}
        </div>
        <br />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    firebase: { update },
  } = props;
  const {
    auth: { email, uid },
    data: { privateProfile, publicProfile },
    profile: { profile_pic },
  } = state.firebase;

  return {
    privateProfile, // Need to keep a separate copy of each profile for isLoaded
    publicProfile,
    profile: { ...privateProfile, ...publicProfile },
    profile_pic,
    uid,
    updateAllProfiles: updateProfiles(update, uid, email),
    updateNotifications: bioNotifs => {
      update(`/notifs/${uid}/pre/`, bioNotifs);
    },
  };
};

const WrappedPageProfile = ({ ...props }) => {
  return (
    <Container>
      <PageProfile {...props} />
    </Container>
  );
};

export default compose(
  // Allows URL checking to determine if user has just returned from authorizing spotify
  withRouter,
  // Pull public and private profile from database
  firebaseConnect(props => [
    {
      path: '/privateProfile/' + props.uid,
      storeAs: 'privateProfile',
    },
  ]),
  connect(mapStateToProps),
)(WrappedPageProfile);
