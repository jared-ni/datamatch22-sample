/** @jsx jsx */

import React, { Component } from 'react';
import { jsx, Button } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  firebaseConnect,
  firestoreConnect,
  isLoaded,
} from 'react-redux-firebase';
import Modal from 'react-bootstrap/Modal';

import Container from 'components/Container';
import Header from 'components/Header';
import Loading from 'components/Loading';
import PicUpload from 'components/PicUpload';
import Textarea from 'components/Textarea';

import { dateOptionsSx } from './DateOptionsStyles';
import Select from 'components/Select';

class DateOptions extends Component {
  state = {
    codes: {},
    modalKey: '',
    show: false,
    loading: true,
    dateOptions: {},
    dateOptionIds: [],
    optionEmails: {},
    uploading: false,
    uploadMsg: {},
    errorMsg: null,
  };
  file = React.createRef();

  // Sets state once date options loaded from firebase/firestore
  componentDidUpdate() {
    const {
      dateOptions,
      codes,
      config,
      school,
      date_option_admins,
    } = this.props;
    if (
      isLoaded(dateOptions, config, codes, date_option_admins) &&
      this.state.loading
    ) {
      const { college_to_dateOption = {} } = config;
      const { admins_to_date_option = {} } = date_option_admins;

      this.setState({
        loading: false,
        dateOptions: dateOptions || {},
        dateOptionIds: college_to_dateOption[school] || [],
        codes: codes || {},
        optionEmails: admins_to_date_option || {},
      });
    }
  }

  // Helper method for editing a property of a date with the given key
  editDateOption = key => {
    return event => {
      const { dateOptions } = this.state;
      // Update changed field to new value
      const newOption = {
        ...dateOptions[key],
        [event.target.name]: event.target.value,
      };
      const newDateOptions = { ...dateOptions };
      newDateOptions[key] = newOption;
      this.setState({ dateOptions: newDateOptions });
    };
  };

  // Creates a new date option and pushes it to the database
  addNewDateOption = event => {
    const { firebase, school, updateSettings } = this.props;

    const newDateOptions = { ...this.state.dateOptions };
    const newDateOptionIds = this.state.dateOptionIds.slice();
    const newOption = {
      name: '',
      address: '',
      url: '',
      description: '',
      logo: '',
      hours: '',
      eligibility: '',
      codeType: event.target.value,
      total: 0,
    };

    // Push new date option to database immediately to avoid image uploads without
    // saving their corresponding date option for later deletion
    const newKey = firebase.push('/dateOptions', newOption).key;
    newDateOptions[newKey] = newOption;
    newDateOptionIds.push(newKey);
    const updates = {};
    updates[`college_to_dateOption.${school}`] = newDateOptionIds;
    updateSettings(updates);

    // Update state
    this.setState({
      dateOptions: newDateOptions,
      dateOptionIds: newDateOptionIds,
    });
  };

  // Adds a date option made by a different school to the user's school
  addOldDateOption = event => {
    const { school, updateSettings } = this.props;
    const newDateOptionIds = this.state.dateOptionIds.slice();

    // Push new date option key to the database
    newDateOptionIds.push(event.target.value);
    const updates = {};
    updates[`college_to_dateOption.${school}`] = newDateOptionIds;
    updateSettings(updates);

    // Update state
    this.setState({
      dateOptionIds: newDateOptionIds,
    });
  };

  // If user deletes date option used by multiple schools, only remove date option ID from school
  // If date option only used by one school, delete date option entirely
  deleteDateOption = key => {
    const {
      config,
      date_option_admins,
      firebase,
      school,
      updateSettings,
      updateDateOptionAdmins,
    } = this.props;
    const { college_to_dateOption } = config;
    const { admins_to_date_option = {} } = date_option_admins;
    const { codes, dateOptions, dateOptionIds } = this.state;
    const updates = {};
    updates.dateOptions = { ...dateOptions };
    updates.codes = { ...codes };

    // Remove key from school mapping
    const newDateOptionIds = dateOptionIds.slice();
    newDateOptionIds.splice(newDateOptionIds.indexOf(key), 1);
    const newConfig = {};
    newConfig[`college_to_dateOption.${school}`] = newDateOptionIds;
    updateSettings(newConfig);

    // Removed any stored edits to the date option, codes or other state objects
    updates.dateOptions[key] = (this.props.dateOptions || {})[key];
    updates.codes[key] = (this.props.codes || {})[key];

    // Also remove any admin email, and if type was generated, replace with original mapping
    const newOptionEmails = { ...this.state.optionEmails };
    delete newOptionEmails[this.findOptionEmail(key)];
    let oldEmail;
    if (updates.dateOptions[key].codeType === 'generated') {
      oldEmail = Object.keys(admins_to_date_option).find(
        e => admins_to_date_option[e] === key,
      );
      if (oldEmail) newOptionEmails[oldEmail] = key;
    }
    // Remove any upload messages stored in the state
    const newUploadMsg = { ...this.state.uploadMsg };
    delete newUploadMsg[key];

    // Check if this was only school that used the date option
    if (
      !Object.keys(college_to_dateOption).find(
        s => s !== school && college_to_dateOption[s].includes(key),
      )
    ) {
      // If type was generated, remove admin email mapping from database
      if (updates.dateOptions[key].codeType === 'generated' && oldEmail) {
        delete newOptionEmails[oldEmail];
        updateDateOptionAdmins({ admins_to_date_option: newOptionEmails });
      }
      // If only used by one school, delete date option from state & database
      updates.dateOptions[key] = null;
      updates.codes[key] = null;
      firebase.update('/', updates);
      // Also remove logo if one existed
      if (dateOptions[key].logo) {
        firebase.deleteFile(`/date_options/${key}.jpg`);
      }
    }

    // Update state
    this.setState({
      codes: updates.codes,
      dateOptions: updates.dateOptions,
      dateOptionIds: newDateOptionIds,
      optionEmails: newOptionEmails,
      uploadMsg: newUploadMsg,
      show: false,
    });
  };

  // Pushes any edits to date options or codes to the database
  saveDateOptions = () => {
    const { firebase, updateDateOptionAdmins } = this.props;
    const updates = { errorMsg: null };
    updates.dateOptions = { ...this.state.dateOptions };
    updates.codes = { ...this.state.codes };
    updates.uploadMsg = { ...this.state.uploadMsg };
    updates.optionEmails = { ...this.state.optionEmails };

    // Remove option data corresponding to codeTypes different from active one
    for (let i = 0; i < this.state.dateOptionIds.length; i++) {
      const key = this.state.dateOptionIds[i];
      const option = { ...updates.dateOptions[key] };
      const optionCodes = { ...updates.codes[key] };

      // Save codes based on codeType
      if (option.codeType === 'generated') {
        option.total = 0;
        if (!option.days)
          option.days = [
            { datesAllotted: 0, datesAvailable: 0 },
            { datesAllotted: 0, datesAvailable: 0 },
            { datesAllotted: 0, datesAvailable: 0 },
            { datesAllotted: 0, datesAvailable: 0 },
            { datesAllotted: 0, datesAvailable: 0 },
            { datesAllotted: 0, datesAvailable: 0 },
            { datesAllotted: 0, datesAvailable: 0 },
          ];
        for (let j = 0; j < option.days.length; j++) {
          let num = Number(option.days[j].datesAvailable);
          if (num < 0) {
            return this.setState({
              errorMsg: 'The number of codes per day cannot be negative.',
            });
          }
          if (num === '') num = 0;
          option.total += num;
          option.days[j].datesAvailable = num;
          option.days[j].datesAllotted = num;
        }
      } else {
        // Remove days & any admin account mapping that may exist
        option.days = null;
        delete updates.optionEmails[this.findOptionEmail(key)];
      }
      if (option.codeType === 'provided') {
        option.total = Object.keys(optionCodes).length || 0;
        option.totalAllotted = option.total;
      } else {
        updates.uploadMsg[key] = null;
      }
      updates.dateOptions[key] = option;
      updates.codes[key] = optionCodes;

      // Check for empty-string codes
      if (optionCodes[''] != null) {
        return this.setState({
          errorMsg: 'Codes must be non-empty.',
        });
      }
    }
    // Save updated dateOptions and codes to database
    firebase.update('/', {
      dateOptions: updates.dateOptions,
      codes: updates.codes,
    });

    // Update the date option admin emails
    updateDateOptionAdmins({ admins_to_date_option: updates.optionEmails });

    // Update state with new saved values
    this.setState(updates);
    alert('Changes saved!');
  };

  // Handles the PicUpload callback by saving the image URL & pushing it to database
  uploadLogo = key => {
    return ({ profile_pic }) => {
      const { dateOptions } = this.state;
      const newOption = {
        ...dateOptions[key],
        logo: profile_pic,
      };

      // Push logo addition to the database
      this.props.firebase.update(`/dateOptions/${key}`, { logo: profile_pic });

      // Update state
      let newDateOptions = { ...dateOptions };
      newDateOptions[key] = newOption;
      this.setState({ dateOptions: newDateOptions });
    };
  };

  // Handles event when user uploads a file to the provided codes file upload
  processCSV = key => {
    return event => {
      this.setState({ uploading: true });
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        // parse CSV and store in state
        const codes = reader.result.trim().split(',');
        // Create dictionary of codes (key: code, value: false)
        const codesDict = {};
        codes.forEach(code => {
          codesDict[String(code)] = false;
        });
        const updates = { uploading: false };
        updates.codes = { ...this.state.codes };
        // Overwrite codes that were there before, if any
        updates.codes[key] = codesDict;
        updates.uploadMsg = { ...this.state.uploadMsg };
        updates.uploadMsg[
          key
        ] = `Uploaded ${codes.length} codes from ${file.name}.`;
        this.setState(updates);
      };

      reader.onerror = () => {
        // print error to console and save to state
        console.log('Error reading CSV', reader.error);
        const updates = { uploading: false };
        const newCode = { ...this.state.codes[key], codes: null };
        updates.codes = { ...this.state.codes };
        updates.codes[key] = newCode;
        updates.uploadMsg = { ...this.state.uploadMsg };
        updates.uploadMsg[
          key
        ] = `There was an error trying to upload codes from ${file.name}.`;
        this.setState(updates);
      };

      reader.readAsText(file);
    };
  };

  // Handles user editing the generated code day inputs
  editDateDays = key => {
    return event => {
      const { dateOptions } = this.state;
      // Update changed date to new value
      const newDays = dateOptions[key].days
        ? dateOptions[key].days.slice()
        : [
            { datesAllotted: 0, datesAvailable: '' },
            { datesAllotted: 0, datesAvailable: '' },
            { datesAllotted: 0, datesAvailable: '' },
            { datesAllotted: 0, datesAvailable: '' },
            { datesAllotted: 0, datesAvailable: '' },
            { datesAllotted: 0, datesAvailable: '' },
            { datesAllotted: 0, datesAvailable: '' },
          ];
      newDays[event.target.name].datesAvailable = event.target.value;

      // Save state
      const newDateOptions = { ...dateOptions };
      newDateOptions[key] = { ...dateOptions[key], days: newDays };
      this.setState({ dateOptions: newDateOptions });
    };
  };

  // Handles user editing the multiuse code for date options
  editMultiUseCode = key => {
    return event => {
      // Update changed code to new value
      const newCode = { [event.target.value]: false };
      const newCodes = { ...this.state.codes };
      newCodes[key] = newCode;
      // Save state
      this.setState({ codes: newCodes });
    };
  };

  findOptionEmail = key =>
    Object.keys(this.state.optionEmails).find(
      email => this.state.optionEmails[email] === key,
    );

  // Handles user editing the multiuse code for date options
  editOptionEmail = key => {
    return event => {
      const newEmails = { ...this.state.optionEmails };
      // Remove old email -> option id mapping
      const oldEmail = this.findOptionEmail(key);
      delete newEmails[oldEmail];
      // Set new mapping
      newEmails[event.target.value] = key;
      // Save state
      this.setState({ optionEmails: newEmails });
    };
  };

  confirm = modalKey => this.setState({ modalKey, show: true });

  // Renders the code information section of an option based on the codeType
  renderCodeInput = (codeType, key, disabled) => {
    const { codes, dateOptions, uploading, uploadMsg } = this.state;
    const option = dateOptions[key];

    if (codeType === 'generated') {
      const days = option.days || [
        { datesAllotted: 0, datesAvailable: '' },
        { datesAllotted: 0, datesAvailable: '' },
        { datesAllotted: 0, datesAvailable: '' },
        { datesAllotted: 0, datesAvailable: '' },
        { datesAllotted: 0, datesAvailable: '' },
        { datesAllotted: 0, datesAvailable: '' },
        { datesAllotted: 0, datesAvailable: '' },
      ];
      return (
        <div>
          <p>Enter the number of dates/codes available each day.</p>
          <span className="input-separator">
            <span className="option-day-input">
              <label className="option-day-label" htmlFor="2/14">
                2/14
              </label>
              <input
                disabled={disabled}
                autoComplete="none"
                className="option-input option-day-input background-border"
                onChange={this.editDateDays(key)}
                type="number"
                value={days[0].datesAllotted}
                name="0"
                id="2/14"
              />
            </span>
            <span className="option-day-input">
              <label className="option-day-label" htmlFor="2/15">
                2/15
              </label>
              <input
                disabled={disabled}
                autoComplete="none"
                className="option-input option-day-input background-border"
                onChange={this.editDateDays(key)}
                type="number"
                value={days[1].datesAllotted}
                name="1"
                id="2/15"
              />
            </span>
            <span className="option-day-input">
              <label className="option-day-label" htmlFor="2/16">
                2/16
              </label>
              <input
                disabled={disabled}
                autoComplete="none"
                className="option-input option-day-input background-border"
                onChange={this.editDateDays(key)}
                type="number"
                value={days[2].datesAllotted}
                name="2"
                id="2/16"
              />
            </span>
          </span>
          <span className="input-separator">
            <span className="option-day-input">
              <label className="option-day-label" htmlFor="2/17">
                2/17
              </label>
              <input
                disabled={disabled}
                autoComplete="none"
                className="option-input option-day-input background-border"
                onChange={this.editDateDays(key)}
                type="number"
                value={days[3].datesAllotted}
                name="3"
                id="2/17"
              />
            </span>
            <span className="option-day-input">
              <label className="option-day-label" htmlFor="2/18">
                2/18
              </label>
              <input
                disabled={disabled}
                autoComplete="none"
                className="option-input option-day-input background-border"
                onChange={this.editDateDays(key)}
                type="number"
                value={days[4].datesAllotted}
                name="4"
                id="2/18"
              />
            </span>
            <span className="option-day-input">
              <label className="option-day-label" htmlFor="2/19">
                2/19
              </label>
              <input
                disabled={disabled}
                autoComplete="none"
                className="option-input option-day-input background-border"
                onChange={this.editDateDays(key)}
                type="number"
                value={days[5].datesAllotted}
                name="5"
                id="2/19"
              />
            </span>
          </span>
          <span className="input-separator">
            <span className="option-day-input">
              <label className="option-day-label" htmlFor="2/20">
                2/20
              </label>
              <input
                disabled={disabled}
                autoComplete="none"
                className="option-input option-day-input background-border"
                onChange={this.editDateDays(key)}
                type="number"
                value={days[6].datesAllotted}
                name="6"
                id="2/20"
              />
            </span>
          </span>
          <input
            disabled={disabled}
            autoComplete="none"
            className="option-input background-border"
            onChange={this.editOptionEmail(key)}
            type="text"
            value={this.findOptionEmail(key) || ''}
            placeholder="Date Option Admin Email"
          />
        </div>
      );
    } else if (codeType === 'provided') {
      return (
        <div>
          <p>Upload a CSV file below containing a list of codes</p>
          <input
            disabled={disabled}
            key="provided-code-upload"
            className="file-upload"
            accept=".csv"
            ref={this.file}
            type="file"
            onChange={this.processCSV(key)}
          />
          {uploading ? (
            <div style={{ marginTop: -10 }}>
              <Loading size="30px" />
            </div>
          ) : uploadMsg[key] || (codes[key] && Object.keys(codes[key])) ? (
            <p style={{ marginBottom: 2.5 }}>
              {uploadMsg[key] ??
                `Using ${
                  Object.keys(codes[key]).length
                } codes uploaded previously.`}
            </p>
          ) : null}
        </div>
      );
    } else if (codeType === 'multiuse') {
      return (
        <div>
          <p>Enter the promo code available to students.</p>
          <input
            disabled={disabled}
            key="multiuse-code-input"
            autoComplete="none"
            className="option-input option-code-input background-border"
            onChange={this.editMultiUseCode(key)}
            type="text"
            value={Object.keys(codes[key] || {}) || ''}
            name="code"
            placeholder="Enter Multi-Use Code"
          />
        </div>
      );
    } else return null;
  };

  render() {
    const {
      errorMsg,
      modalKey,
      dateOptions,
      dateOptionIds,
      show,
      loading,
    } = this.state;

    if (loading) {
      return (
        <div style={{ height: 200 }}>
          <Loading />
        </div>
      );
    }

    const disabled = Date.now() > this.props.cutoff;

    return (
      <Container>
        <div sx={dateOptionsSx}>
          <Header>Date Options</Header>
          {disabled
            ? 'The survey is closed! Date options cannot be edited any further after the survey is closed.'
            : 'Add a list of Date Options offered at your school. Make sure to hit Save Changes!'}
          <br />
          <br />
          <div>
            {Object.keys(dateOptions)
              .filter(key => dateOptionIds.includes(key))
              .map(key => {
                const option = dateOptions[key];
                return (
                  <div className="date-option" key={key}>
                    <div>
                      <h5 className="option-header">Date Option Info</h5>
                      <div className="remove-option">
                        <Button
                          variant="secondary"
                          disabled={disabled}
                          onClick={() => this.confirm(key)}
                        >
                          Remove <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                      <input
                        autoComplete="none"
                        disabled={disabled}
                        className="option-input background-border"
                        onChange={this.editDateOption(key)}
                        type="text"
                        value={option.name}
                        name="name"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <div className="logo-upload">
                        <PicUpload
                          name={key}
                          original_pic={option.logo}
                          path="/date_options"
                          size={179}
                          updateURL={this.uploadLogo(key)}
                          deleteFromStorage
                        />
                      </div>
                      <input
                        disabled={disabled}
                        autoComplete="none"
                        className="option-input background-border"
                        onChange={this.editDateOption(key)}
                        type="text"
                        value={option.address}
                        name="address"
                        placeholder="Address/Location"
                      />
                      <input
                        disabled={disabled}
                        autoComplete="none"
                        className="option-input background-border"
                        onChange={this.editDateOption(key)}
                        type="text"
                        value={option.hours}
                        name="hours"
                        placeholder="Available Hours (ex. 9am - 9pm)"
                      />
                      <input
                        disabled={disabled}
                        autoComplete="none"
                        className="option-input background-border"
                        onChange={this.editDateOption(key)}
                        type="text"
                        value={option.url}
                        name="url"
                        placeholder="Web Address"
                      />
                      <div className="text-area-container">
                        <Textarea
                          disabled={disabled}
                          className="option-text-area background-border"
                          handleInputChange={this.editDateOption(key)}
                          name="description"
                          placeholder="Date Description (e.g. 2 waffles + 2 drinks)"
                          rows={3}
                          type="text"
                          value={option.description}
                        />
                      </div>
                    </div>
                    <h5>Date Option Codes</h5>
                    {this.renderCodeInput(option.codeType, key, disabled)}
                    <p>Date Eligibility</p>
                    <Select
                      disabled={disabled}
                      className="option-input background-border option-select"
                      handleInputChange={this.editDateOption(key)}
                      name="eligibility"
                      value={option.eligibility}
                      placeholder="Select"
                      labels={['All Matches', 'Top Algorithm Matches']}
                      values={['all', 'algo']}
                    />
                  </div>
                );
              })}
          </div>
          <select
            disabled={disabled}
            className="accent-select option-select"
            onChange={this.addNewDateOption}
            value={''}
            readOnly
          >
            <option className="background-border" value="" disabled>
              Create new date option
            </option>
            <option className="background-border" value="generated">
              Datamatch Generated Codes
            </option>
            <option className="background-border" value="provided">
              Date Option Provided Codes
            </option>
            <option className="background-border" value="multiuse">
              Single Multi-Use Code
            </option>
          </select>
          <br />
          <select
            disabled={disabled}
            className="accent-select option-select"
            onChange={this.addOldDateOption}
            value={''}
            readOnly
          >
            <option className="background-border" value="" disabled>
              Add existing date option
            </option>
            {Object.keys(dateOptions)
              .filter(
                key => dateOptions[key]?.name && !dateOptionIds.includes(key),
              )
              .map(key => (
                <option className="background-border" key={key} value={key}>
                  {dateOptions[key].address
                    ? `${dateOptions[key].name} at ${dateOptions[key].address}`
                    : `${dateOptions[key].name}`}
                </option>
              ))}
          </select>
          <br />
          {errorMsg ? <div className="error-message">{errorMsg}</div> : null}
          <Button
            variant="accent"
            disabled={disabled}
            onClick={this.saveDateOptions}
          >
            <i className="fas fa-check checkmark"></i>Save Changes
          </Button>
          <br />
          <Modal onHide={() => this.setState({ show: false })} show={show}>
            <Modal.Body className="modal-container">
              <h4>Are you sure you want to remove this date option?</h4>
              <br />
              <Button
                disabled={disabled}
                onClick={() => this.deleteDateOption(modalKey)}
                mr={2}
              >
                I'm sure.
              </Button>
              <Button
                variant="secondary"
                onClick={() => this.setState({ show: false })}
              >
                Just kidding!
              </Button>
            </Modal.Body>
          </Modal>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    cutoff: state.firebase.data.cutoff,
    dateOptions: state.firebase.data.dateOptions || {},
    codes: state.firebase.data.codes || {},
    config: state.firestore.data.config,
    date_option_admins: state.firestore.data.date_option_admins,
    updateSettings: settings => {
      props.firestore.update(
        {
          collection: 'settings',
          doc: 'config',
        },
        settings,
      );
    },
    updateDateOptionAdmins: optionEmails => {
      props.firestore.set(
        {
          collection: 'portals',
          doc: 'date_option_admins',
        },
        optionEmails,
      );
    },
  };
};

export default compose(
  firebaseConnect(() => [
    { path: `/dateOptions` },
    { path: `/codes` },
    { path: `/unix/dateOptions`, storeAs: 'cutoff' },
  ]),
  firestoreConnect(() => [
    {
      collection: 'settings',
      doc: 'config',
      storeAs: 'config',
    },
    {
      collection: 'portals',
      doc: 'date_option_admins',
      storeAs: 'date_option_admins',
    },
  ]),
  connect(mapStateToProps),
)(DateOptions);
