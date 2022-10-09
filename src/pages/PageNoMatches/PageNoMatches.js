import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

import Loading from 'components/Loading';
import Schedule from 'components/Schedule';
import ConstructionGif from 'assets/under-construction.gif';

class NoMatch extends Component {
  renderLiveSurvey = () => (
    <div>
      <div>
        <img alt="under construction" src={ConstructionGif} width={300} />
      </div>
      <div>
        In the meantime, you can finalize your{' '}
        <u>
          <Link to="/app/survey">survey</Link>
        </u>{' '}
        responses, browse our{' '}
        <u>
          <Link to="/app/faq">FAQ</Link>
        </u>
        , or check out our{' '}
        <u>
          <Link to="/app/press">press page</Link>
        </u>
        .
      </div>
    </div>
  );

  renderLiveProcessing = () => {
    if (!isLoaded(this.props.publicProfile)) {
      return (
        <div style={{ height: 200 }}>
          <Loading />
        </div>
      );
    }

    return (
      <div>
        <div>
          <img alt="under construction" src={ConstructionGif} width={300} />
        </div>
        <div style={{ marginBottom: 10 }}>
          We're calculating matches now! Hang tight!
        </div>
        <div>
          In the meantime, you can finalize your{' '}
          <u>
            <Link to="/app/profile">profile</Link>
          </u>
          , browse our{' '}
          <u>
            <Link to="/app/faq">FAQ</Link>
          </u>
          , or check out our{' '}
          <u>
            <Link to="/app/press">press page</Link>
          </u>
          . While your here, might as well also check to make sure your date
          availability is up to date!
        </div>
        <div className="schedule">
          <Schedule />
        </div>
      </div>
    );
  };

  renderMessage() {
    const { status } = this.props;
    if (status === 'live-survey') {
      return this.renderLiveSurvey();
    } else if (status === 'live-processing') {
      return this.renderLiveProcessing();
    }
  }

  renderHeader = () => {
    return "Sit tight — matches will come out on Valentine's Day!";
  };

  render() {
    return (
      <div>
        <div className="header-description">{this.renderHeader()}</div>
        {this.renderMessage()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { publicProfile: state.firebase.data.publicProfile };
};

export default compose(connect(mapStateToProps))(NoMatch);
