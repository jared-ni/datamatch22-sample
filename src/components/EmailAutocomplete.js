/** @jsx jsx */

import { Component } from 'react';
import { jsx } from '@emotion/core';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import Autosuggest from 'react-autosuggest';

import Loading from 'components/Loading';

class EmailAutocomplete extends Component {
  state = {
    live: false, // true if suggestions corresponds to current input
    loading: false, // true if suggestions are being loaded
    suggestions: [], // list of suggestions
    showText: true, // true if instructions are shown
  };

  // Listens for 'enter' to fetch suggestions
  keyPressed = event => {
    const { key, target } = event;
    if (key === 'Enter' && target.value) {
      const { live, suggestions } = this.state;
      if (suggestions.length === 0 || !live) {
        this.setState({
          loading: true,
          showText: false,
        });
        this.fetchSuggestions({ value: target.value });
      }
    }
  };

  // Fetch suggestions using cloud function
  fetchSuggestions = async ({ value }) => {
    const getEmailAutocomplete = this.props.firebase
      .functions()
      .httpsCallable('user-emailSearch');
    const emails = await getEmailAutocomplete({ email: value });
    this.setState({
      live: true,
      loading: false,
      suggestions: emails.data,
    });
  };

  // Clear suggestions
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // value of suggestion
  getSuggestionValue = value => value.email;

  // How to render each suggestion item
  renderSuggestion = suggestion => (
    <div>
      <div>{suggestion.name}</div>
      <div style={{ color: '#524f6c', fontSize: 12 }}>{suggestion.email}</div>
    </div>
  );

  // Handles on change for the input
  handleChange = (event, { newValue, method }) => {
    const { handleInputChange, name } = this.props;
    handleInputChange({ target: { name, value: newValue } });
    if (method === 'type') {
      this.setState({ live: false, showText: true });
    }
  };

  // How to render the suggestions container
  renderSuggestionsContainer = ({ containerProps, children, query }) => {
    return (
      <div
        {...containerProps}
        style={{ position: 'absolute', minWidth: '15em' }}
      >
        {this.state.showText && query.length > 0 && (
          <div style={{ border: '1px solid #b1b1b1', padding: '5px 10px' }}>
            Press Enter to search
          </div>
        )}
        {this.state.loading && <Loading color="black" />}
        {children}
      </div>
    );
  };

  render() {
    const { name, value } = this.props;
    const inputProps = {
      autoComplete: 'none',
      name,
      onChange: this.handleChange,
      onKeyDown: this.keyPressed,
      placeholder: 'Type an email',
      value,
    };
    return (
      <div style={{ display: 'inline-block' }}>
        <Autosuggest
          getSuggestionValue={this.getSuggestionValue}
          inputProps={inputProps}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionsFetchRequested={() => {}} // required prop but we don't use
          renderSuggestion={this.renderSuggestion}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          suggestions={this.state.suggestions}
        />
      </div>
    );
  }
}

export default compose(
  // to get firebase cloud functions
  firebaseConnect(),
)(EmailAutocomplete);
