/** @jsx jsx */

import { Component } from 'react';
import { jsx, Button } from 'theme-ui';
import Header from 'components/Header';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  firestoreConnect,
  firebaseConnect,
  isLoaded,
} from 'react-redux-firebase';
import moment from 'moment';

import Loading from 'components/Loading';
import Container from 'components/Container';
import launch from 'constants/Launch';
import InputList from './InputList';

const profileSx = {
  '.inputcontainer': {
    display: 'table',
  },

  '.input': {
    width: '300px',
    height: '40px',
    background: 'white',
    border: 'none',
    mt: 2,
    mr: 2,
  },
};

class Profile extends Component {
  state = { loading: true, prelaunch: moment().isBefore(launch) };

  componentDidUpdate() {
    const { school, settings } = this.props;

    if (isLoaded(settings) && this.state.loading) {
      const { college_to_dorm = {}, college_to_email = {} } = settings;

      this.setState({
        dorms: college_to_dorm[school] || [],
        emails: college_to_email[school] || [],
        loading: false,
        settings,
      });
    }
  }

  dictToArray = dict => {
    let newArray = [];
    for (var key in dict) {
      newArray.push(dict[key]);
    }
    return newArray;
  };

  addInput = name => {
    // append empty string to end of array
    this.setState({ [name]: [...this.state[name].slice(), ''] });
  };

  removeInput = (index, inputs, name) => {
    const newInputs = inputs.slice();
    delete newInputs[index];
    this.setState({ [name]: this.dictToArray(newInputs) });
  };

  editInput = (index, value, inputs, name) => {
    const newInputs = inputs.slice();
    newInputs[index] = value;
    this.setState({ [name]: this.dictToArray(newInputs) });
  };

  assignSettings = () => {
    const { school, updateSettings } = this.props;

    const emails = this.state.emails.filter(email => {
      return email !== '';
    });

    const dorms = this.state.dorms.filter(dorm => {
      return dorm !== '';
    });

    let updates = {};
    updates[`college_to_dorm.${school}`] = dorms;
    updates[`college_to_email.${school}`] = emails;

    updateSettings(updates);
    alert('Config saved!');
  };

  onNameInputChange = e => this.setState({ name: e.target.value });

  render() {
    const { dorms, emails, loading } = this.state;

    if (loading) {
      return (
        <div style={{ height: 200 }}>
          <Loading />
        </div>
      );
    }

    return (
      <Container>
        <div sx={profileSx}>
          <Header>School</Header>
          <h4>Valid Email Suffix</h4>
          <div className="description">
            Do not include the @ symbol in these suffixes!
          </div>
          <InputList
            addInput={this.addInput}
            editInput={this.editInput}
            inputs={emails}
            name="emails"
            placeholder="college.harvard.edu"
            removeInput={this.removeInput}
          />

          <br />

          <h4>Affiliations</h4>
          <div className="description">
            Add the different types of affiliations here — some schools choose
            to list dorms, others choose to list sub-schools like “Engineering”.
            It’s up to you what makes the most sense for you!
          </div>
          <InputList
            addInput={this.addInput}
            editInput={this.editInput}
            inputs={dorms}
            name="dorms"
            removeInput={this.removeInput}
          />

          {this.state.prelaunch && (
            <Button variant="accent" mt={4} onClick={this.assignSettings}>
              <i className="fas fa-check checkmark"></i>
              {' Save Changes'}
            </Button>
          )}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    settings: state.firestore.data.config,
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
  firebaseConnect(),
  firestoreConnect(() => [
    {
      collection: 'settings',
      doc: 'config',
      storeAs: 'config',
    },
  ]),
  connect(mapStateToProps),
)(Profile);
