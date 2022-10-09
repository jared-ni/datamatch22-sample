/** @jsx jsx */

import { Component } from 'react';
import { jsx } from '@emotion/core';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import Loading from 'components/Loading';
import PageMessages from './PageMessages/PageMessages';
import { LoadingText } from 'constants/LoadingText';
import { areMatchesLive } from 'utils/status';

// Wrapper component that provides searchIds to children
class GetSearchResultsContainer extends Component {
  state = {
    loadingSearch: true,
    searchUids: [],
    loadingIndex: 0,
  };

  // Calls user-userSearch based on query, sets state.searchUids to results
  async updateSearchQuery() {
    const { query, firebase, status } = this.props;
    const params = new URLSearchParams(query);
    const name = params.get('name');

    // Do not search if matches aren't live
    if (!areMatchesLive(status)) {
      this.setState({ loadingSearch: false });
      return;
    }

    // Does not search if name param does not exist
    if (!name) {
      this.setState({ loadingSearch: false });
      return;
    }

    this.setState({ loadingSearch: true });
    // Only use first two words in search
    const [first, last] = name.toLowerCase().split(' ');

    const getSearchUids = firebase.functions().httpsCallable('user-userSearch');
    const { data: searchUids } = await getSearchUids({ first, last });

    this.setState({ loadingSearch: false, searchUids });
  }

  // On component mount, reset search query
  async componentDidMount() {
    await this.updateSearchQuery();
  }

  // If new query params, reset search query
  async componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      await this.setState({
        loadingIndex: Math.floor(Math.random() * LoadingText.length),
      });
      await this.updateSearchQuery();
    }
  }

  render() {
    const { loadingSearch, searchUids } = this.state;
    const { matchCatalog } = this.props;

    if (loadingSearch) {
      return (
        <div style={{ height: 200 }}>
          <Loading color="black" />
          <div style={{ textAlign: 'center' }}>
            {LoadingText[this.state.loadingIndex]}
          </div>
        </div>
      );
    }

    // find matchCatalog objects for searchUids
    const filteredSearchCatalog = {};
    searchUids.forEach(uid => {
      filteredSearchCatalog[uid] = matchCatalog[uid] || {};
    });

    // render page messages based on the match catalog
    return (
      <WrappedPageMessages
        catalog={filteredSearchCatalog}
        searchUids={searchUids}
        {...this.props}
      />
    );
  }
}

// this wrapped page message pulls the public profiles for the users that came back from search
// that aren't in our matchCatalog already
const WrappedPageMessages = firebaseConnect(({ catalog }) => {
  // if we are searching, we find the public profiles we haven't pulled yet and pull them
  return Object.keys(catalog).flatMap(otherUid => {
    const { matched } = catalog[otherUid];
    // the other user must not have a match with the current user
    return matched !== true || matched !== false
      ? [
          {
            path: `/publicProfile/${otherUid}`,
            storeAs: `/profiles/${otherUid}`,
          },
        ]
      : [];
  });
})(PageMessages);

export default compose(
  // to get firebase cloud functions
  firebaseConnect(),
)(GetSearchResultsContainer);
