/** @jsx jsx */

import { Component } from 'react';
import MultiSelect from 'react-multi-select-component';
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
import Toggle from 'react-toggle';

// styling consistent with date options page
const sponsorSx = {
  '.option-header': {
    display: 'inline-block',
  },
  '.background-border': {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
    color: theme => `${theme.colors.text}`,
  },
  '.option-input': {
    textAlign: 'left',
    width: '267px',
    height: '33px',
    marginBottom: '3px',
    padding: '1px 10px 1px 10px',
    color: 'black',
    fontSize: '14px',
  },
  '.input-separator + .input-separator': {
    marginLeft: '1.33px',
  },
  '.option-select': {
    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '95% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
  },
  '.option-text-area': {
    textAlign: 'left',
    width: '267px',
    height: '74px',
    color: 'black',
    fontSize: '14px',
  },
  '.text-area-container': {
    display: 'inline-block',
  },
  select: {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
    color: theme => `${theme.colors.text}`,
  },
  '.select-container': {
    display: 'inline-block',
    textAlign: 'left',
    width: '267px',
    // height: '33px',
    marginBottom: '3px',
    // padding: '1px 10px 1px 10px',
  },
  '.logo-upload': {
    float: 'left',
    marginRight: '10px',
  },
  '.remove-option': {
    fontSize: '14px',
    float: 'right',
  },
  '.sponsor': {
    width: '482px',
    border: theme => `1px solid ${theme.colors.text}`,
    borderRadius: '6px',
    bg: 'lightPink',
    color: 'text',
    padding: '10px',
    paddingBottom: '7px',
    marginBottom: '10px',
    fontSize: '14px',
  },
  '.file-upload': {
    border: 'none',
  },
  '.accent-select': {
    marginTop: '5px',
    display: 'inline-block',
    textAlign: 'center',
    color: theme => `${theme.colors.primary}`,
    bg: 'lightPink',
    border: `1.5px solid`,
    borderRadius: '4px',
    fontWeight: '500',
    padding: '7px 10px',
    paddingRight: '35px',
    height: 'auto',
    width: 'auto',
  },
  '.accent-select:hover': {
    bg: theme => `${theme.colors.pink}`,
    color: 'white',
  },
  '.accent-select:not(:disabled)': {
    cursor: 'pointer',
  },

  // for mobile devices
  '@media only screen and (max-width: 768px)': {
    '.option-header': {
      marginTop: '4px',
      marginBottom: '8px',
    },
    '.logo-upload': {
      float: 'none',
      textAlign: 'center',
      marginRight: '0px',
    },
    '.option-input': {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    '.input-separator': {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '267px',
    },
    '.input-separator + .input-separator': {
      marginLeft: 'auto',
    },
    '.text-area-container': {
      display: 'block',
    },
    '.select-container': {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    '.option-text-area': {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginBottom: '3px',
    },
    '.sponsor': {
      width: 'auto',
    },
  },
};

const sponsorModalSx = {
  '.modal-container': {
    textAlign: 'center',
    padding: '40px',
  },
  '.modal-question': {
    fontSize: '22px',
    marginBottom: '20px',
  },
  '.modal-cancel': {
    cursor: 'pointer',
  },
};

class SchoolSponsors extends Component {
  state = {
    modalKey: '',
    show: false,
    loading: true,
    sponsors: {},
    sponsorIds: [],
  };

  // Sets state once sponsors loaded from firebase/firestore
  componentDidUpdate() {
    const { sponsors, config, school } = this.props;
    if (isLoaded(config) && isLoaded(sponsors) && this.state.loading) {
      const { college_to_sponsors = {} } = config;

      this.setState({
        loading: false,
        sponsors: sponsors || {},
        sponsorIds: college_to_sponsors[school] || [],
      });
    }
  }

  // Edit property of sponsor with given key
  editSponsor = key => {
    return event => {
      const { sponsors } = this.state;
      // Update changed field to new value
      const newSponsor = {
        ...sponsors[key],
        [event.target.name]: event.target.value,
      };
      let newSponsors = { ...sponsors };
      newSponsors[key] = newSponsor;
      this.setState({ sponsors: newSponsors });
    };
  };

  handleBlurbLocationsChange = key => {
    return selected => {
      const { sponsors } = this.state;
      const selectedBlurbLocations = selected.slice();
      const newSponsor = {
        ...sponsors[key],
        blurbLocations: selectedBlurbLocations,
      };
      let newSponsors = { ...sponsors };
      newSponsors[key] = newSponsor;
      this.setState({ sponsors: newSponsors });
    };
  };

  handleToggleChange = key => {
    return () => {
      const { sponsors } = this.state;
      const newSponsor = {
        ...sponsors[key],
        allSchools: !sponsors[key].allSchools,
      };
      let newSponsors = { ...sponsors };
      newSponsors[key] = newSponsor;
      this.setState({ sponsors: newSponsors });
    };
  };

  // Creates a new sponsor and pushes it to the database
  addNewSponsor = () => {
    let newSponsors = { ...this.state.sponsors };
    let newSponsorIds = this.state.sponsorIds.slice();
    const newSponsor = {
      name: '',
      url: '',
      description: '',
      tagline: '',
      logo: '',
      tier: 'cupid',
      allSchools: false,
      blurbLocations: [{ label: 'Sponsors Page', value: 'sponsors-page' }],
    };
    const newKey = this.props.firebase.push('/sponsors').key;
    newSponsors[newKey] = newSponsor;
    newSponsorIds.push(newKey);
    this.setState({
      sponsors: newSponsors,
      sponsorIds: newSponsorIds,
    });
  };

  // Adds a school sponsor made by a different school to the user's school
  addOldSponsor = event => {
    const { school, updateSettings } = this.props;
    const newSponsorIds = this.state.sponsorIds.slice();

    // Push new sponsor key to the database
    newSponsorIds.push(event.target.value);
    const updates = {};
    updates[`college_to_sponsors.${school}`] = newSponsorIds;
    updateSettings(updates);

    // Update state
    this.setState({
      sponsorIds: newSponsorIds,
    });
  };

  // If user deletes sponsor used by multiple schools, only remove sponros ID from school
  // If sponros only used by one school, delete sponsor entirely
  // TODO need to test all cases for deleting data & updating database/state correectly
  deleteSponsor = key => {
    const { config, firebase, school, updateSettings } = this.props;
    const { college_to_sponsors } = config;
    const { sponsors, sponsorIds } = this.state;
    const updates = {};
    updates.sponsors = { ...sponsors };

    // Remove key from school mapping
    const newSponsorIds = sponsorIds.slice();
    newSponsorIds.splice(newSponsorIds.indexOf(key), 1);
    const newConfig = {};
    newConfig[`college_to_sponsors.${school}`] = newSponsorIds;
    updateSettings(newConfig);

    // Remove any stored edits
    updates.sponsors[key] = (this.props.sponsors || {})[key];

    // Remove any upload messages stored in the state
    const newUploadMsg = { ...this.state.uploadMsg };
    delete newUploadMsg[key];

    // Check if this was only school that used the sponsor
    if (
      !Object.keys(college_to_sponsors).find(
        s => s !== school && college_to_sponsors[s].includes(key),
      )
    ) {
      // If only used by one school, delete sponsor from state & database
      updates.sponsors[key] = null;
      firebase.update('/', updates);
      // Also remove logo if one existed
      if (sponsors[key].logo) {
        firebase.deleteFile(`/school_sponsors/${key}.jpg`);
      }
    }

    // Update state
    this.setState({
      sponsors: updates.sponsors,
      sponsorIds: newSponsorIds,
      uploadMsg: newUploadMsg,
      show: false,
    });
  };

  // Pushes any edits to the database
  saveSponsors = () => {
    const { firebase, school, updateSettings } = this.props;
    // Save new sponsors to sponsors node in database
    firebase.update('/sponsors', this.state.sponsors);

    // Save new sponsorId mappings to firestore document
    let updates = {};
    updates[`college_to_sponsors.${school}`] = this.state.sponsorIds;
    updateSettings(updates);

    alert('Changes saved!');
  };

  uploadLogo = key => {
    return ({ profile_pic }) => {
      const { sponsors } = this.state;
      const newSponsor = {
        ...sponsors[key],
        logo: profile_pic,
      };
      let newSponsors = { ...sponsors };
      newSponsors[key] = newSponsor;
      this.setState({ sponsors: newSponsors });
    };
  };

  findOptionEmail = key =>
    Object.keys(this.state.optionEmails).find(
      email => this.state.optionEmails[email] === key,
    );

  confirm = modalKey => this.setState({ modalKey, show: true });

  render() {
    const { modalKey, sponsors, sponsorIds, show, loading } = this.state;
    const { school } = this.props;
    const options = [
      { label: 'Sponsors Page', value: 'sponsors-page' },
      { label: 'Home Page', value: 'home-page' },
      { label: 'Results Page', value: 'results-page' },
    ];

    if (loading) {
      return (
        <div style={{ height: 200 }}>
          <Loading />
        </div>
      );
    }

    return (
      <Container>
        <div sx={sponsorSx}>
          <Header>School Sponsors</Header>
          Make sure to hit Save Changes!
          <br />
          <br />
          <div>
            {Object.keys(sponsors)
              .filter(key => sponsorIds.includes(key))
              .map(key => {
                const sponsor = sponsors[key];
                return (
                  <div className="sponsor" key={key}>
                    <div>
                      <h5 className="option-header">Sponsor Information</h5>
                      <div className="remove-option">
                        <Button
                          variant="secondary"
                          onClick={() => this.confirm(key)}
                        >
                          Remove <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                      <input
                        className="option-input background-border"
                        onChange={this.editSponsor(key)}
                        type="text"
                        value={sponsor.name}
                        name="name"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <div className="logo-upload">
                        <PicUpload
                          name={key}
                          original_pic={sponsor.logo}
                          path="/school_sponsors"
                          size={179}
                          updateURL={this.uploadLogo(key)}
                        />
                        {school === 'Harvard' && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '16px',
                            }}
                          >
                            <Toggle
                              checked={sponsors[key].allSchools}
                              onChange={this.handleToggleChange(key)}
                              style={{ marginRight: '10px' }}
                            />
                            <span style={{ marginLeft: '10px' }}>
                              All schools
                            </span>
                          </div>
                        )}
                      </div>
                      <input
                        className="option-input background-border"
                        onChange={this.editSponsor(key)}
                        type="text"
                        value={sponsor.tagline}
                        name="tagline"
                        placeholder="Tagline (optional)"
                      />
                      <input
                        className="option-input background-border"
                        onChange={this.editSponsor(key)}
                        type="text"
                        value={sponsor.url}
                        name="url"
                        placeholder="Web Address"
                      />
                      <select
                        name="tier"
                        onChange={this.editSponsor(key)}
                        className="select-container option-select"
                      >
                        <option disabled>Select tier</option>
                        <option value="cupid">Cupid</option>
                        <option value="aurora">Aurora</option>
                        <option value="rose">Rose</option>
                      </select>
                      <div className="select-container">
                        <MultiSelect
                          className="multi-select"
                          name="blurbLocations"
                          options={options}
                          value={this.state.sponsors[key].blurbLocations}
                          onChange={this.handleBlurbLocationsChange(key)}
                          labelledBy={'Select blurb locations'}
                        />
                      </div>
                      <div className="text-area-container">
                        <Textarea
                          className="option-text-area background-border"
                          handleInputChange={this.editSponsor(key)}
                          name="description"
                          placeholder="Blurb"
                          rows={3}
                          type="text"
                          value={sponsor.description}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <Button onClick={this.addNewSponsor}>
            Create new school sponsor
          </Button>
          <br />
          <select
            className="accent-select option-select"
            onChange={this.addOldSponsor}
            value={''}
            readOnly
          >
            <option className="background-border" value="" disabled>
              Add existing school sponsor
            </option>
            {Object.keys(sponsors)
              .filter(
                key =>
                  sponsors[key]?.name &&
                  !sponsorIds.includes(key) &&
                  !sponsors[key].allSchools,
              )
              .map(key => (
                <option className="background-border" key={key} value={key}>
                  {`${sponsors[key].name}`}
                </option>
              ))}
          </select>
          <br />
          <Button mt={4} variant="accent" onClick={this.saveSponsors}>
            <i className="fas fa-check checkmark"></i> Save Changes
          </Button>
          <br />
          <Modal
            sx={sponsorModalSx}
            onHide={() => this.setState({ show: false })}
            show={show}
          >
            <Modal.Body className="modal-container">
              <h4>Are you sure you want to remove this sponsor?</h4>
              <br />
              <Button onClick={() => this.deleteSponsor(modalKey)} mr={2}>
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
    sponsors: state.firebase.data.sponsors,
    config: state.firestore.data.config,
    updateSettings: settings => {
      props.firestore.update(
        {
          collection: 'settings',
          doc: 'config',
        },
        settings,
      );
    },
  };
};

export default compose(
  firebaseConnect(() => [{ path: `/sponsors` }]),
  firestoreConnect(() => [
    {
      collection: 'settings',
      doc: 'config',
      storeAs: 'config',
    },
  ]),
  connect(mapStateToProps),
)(SchoolSponsors);
