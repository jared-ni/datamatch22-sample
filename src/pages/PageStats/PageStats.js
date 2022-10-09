/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

import Container from 'components/Container';
import Header from 'components/Header';
import Loading from 'components/Loading';
import InfoCard from './InfoCard';
import { Mixpanel } from 'utils/mixpanel.js';

import ThirstIndex from 'stats/ThirstIndex';
import ThirstIndexHorizontal from 'stats/ThirstIndexHorizontal';
import LifeSatisfaction from 'stats/LifeSatisfaction';
import Spotify from 'stats/Spotify';
import DormMatches from 'stats/DormMatches';
import YearMatches from 'stats/YearMatches';
import AnswersVertical from 'stats/AnswersVertical';

import { pageStatsStyle, pageStatsSx } from 'pages/PageStats/PageStatsStyles';
// import AnswerImpact from 'stats/AnswerImpact';
import WordFreq from 'stats/WordFreq';

class PageStats extends Component {
  state = { loading: true, category: 'matches' };

  async componentDidMount() {
    // Web analytics
    Mixpanel.track('Stats_Page', {});
    // grab stats from Firestore
    const snapshot = await this.props.firestore
      .collection('stats')
      .doc('totals')
      .get();

    const collegeData = snapshot.data();

    // then set state correspondingly
    this.setState({ collegeData, loading: false });
  }

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    const { college } = this.props;
    const { /*collegeData,*/ loading } = this.state;

    if (loading) {
      return <Loading />;
    }
    const isMobile = window.innerWidth <= 1000;

    return (
      <Container maxWidth={'1000px'}>
        <div className="PageStats" sx={pageStatsSx} css={pageStatsStyle}>
          <div className="stats-header">
            <Header>Stats</Header>
          </div>
          {isMobile ? (
            <div className="header-text">
              Stats are best viewed on a wide screen! Use a larger display to
              see all the stats for this year.
            </div>
          ) : (
            <div />
          )}
          <div className="stats-display">
            <div className="matches-container">
              <div className="insert-10">
                <div className="stats-title">2022 Matches in Summary</div>
                <br />
                <br />
                <div className="cards">
                  <InfoCard>
                    <p> The Algorithm™ generated</p>
                    <h3>234,617</h3>
                    <p>
                      total matches across
                      <br />
                      <br />
                      <b>43</b> schools
                    </p>
                  </InfoCard>
                  <InfoCard>
                    <h3>45,969</h3>
                    <p>
                      total eligible users had on average
                      <br />
                      <br />
                      <b>10.21</b> generated matches each
                    </p>
                  </InfoCard>
                </div>
              </div>
              <h4>How did users answer the survey this year?</h4>

              <div className="row-container">
                {/* <div className="insert-1">
                  <div className="stats-title">
                    How you answered the survey:
                  </div>
                  <div className="stats-spacer" />
                  <div className="stats-caption">
                    How you answered the survey impaced the amount of matches
                    you got. This was the most impactful question in the survey
                    for {college} in terms of matches received for users.
                  </div>
                  <AnswerImpact college={college} />
                </div>
                <div className="insert-3">
                  <div className="stats-title">
                    How others answered the survey:
                  </div>
                  <AnswersVertical college={college} />
                </div> */}
                <div className="insert-12">
                  <div className="stats-title">
                    How others answered the survey:
                  </div>
                  <AnswersVertical college={college} />
                </div>
              </div>
              <h4>How did users get matched by the Algorithm™ this year?</h4>
              <div className="row-container">
                <div className="insert-8">
                  <div className="stats-subtitle">Matches between dorms</div>
                  <DormMatches college={college} />
                </div>
                <div className="insert-9">
                  <div className="stats-subtitle">Matches between years</div>
                  <YearMatches college={college} />
                </div>
              </div>

              {isMobile ? (
                <div />
              ) : (
                <div>
                  <h4>How did users fill out their profiles this year?</h4>
                  <div className="row-container">
                    <div className="insert-8">
                      <div className="stats-title">
                        Which artists you're listening to:
                      </div>
                      <div className="stats-caption">
                        Based on your profiles, we discovered which artists were
                        fan favorites across the schools through Spotify. Only
                        artists with 50+ listeners who were signed up for
                        Datamatch are displayed.
                      </div>
                      <Spotify />
                    </div>
                    <div className="insert-9">
                      <div className="stats-title">
                        How you describe yourselves:
                      </div>
                      <div className="stats-caption">
                        These are the words most commonly used in your bios,
                        with mundane words like "the" and "you" filtered out.
                      </div>
                      <WordFreq college={college} />
                    </div>
                  </div>

                  <h4>Interested in other stats on love and relationships? </h4>
                  <div className="stats-caption">
                    Past Datamatch users across all schools have tended to show
                    higher relationship satisfaction, higher perceived
                    self-desirability, and an increased number of relationships
                    when they said they were more satisfied with their life. For
                    more stats on data like this, check out our analysis from a
                    couple years ago in the{' '}
                    <a href="https://sol.datamatch.me"> State of Love</a>.
                  </div>
                  <div className="row-container">
                    <div className="insert-7">
                      <LifeSatisfaction
                        filter={'life_sat-num_relationships'}
                        yAxis={'Num. of Relationships'}
                      />
                    </div>
                    <div className="insert-7">
                      <LifeSatisfaction
                        filter={'life_sat-relationship_sat'}
                        yAxis={'Relationship Sat.'}
                      />
                    </div>
                    <div className="insert-7">
                      <LifeSatisfaction
                        filter={'life_sat-self_desirability'}
                        yAxis={'Self Desirability'}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="matches-container">
              <br />
              <h3>2021 Matches in Summary</h3>
              <br />
              <div className="cards">
                <InfoCard>
                  <h3>40,149</h3>
                  <p>
                    total users in 2021 across <b>33</b> schools
                    <br />
                    <br />
                    with <b>31.6%</b> having at least one successful match
                  </p>
                </InfoCard>
                <InfoCard>
                  <h3>58.8%</h3>
                  <p>
                    users looking for love and/or friendship
                    <br />
                    <br />
                    with <b>27.6%</b> just looking for love and <b>13.9%</b>{' '}
                    just looking for friendship
                  </p>
                </InfoCard>
                <InfoCard>
                  <h3>3,419</h3>
                  <p>
                    crushes submitted in{' '}
                    <Link to="/app/roulette">Crush Roulette</Link>
                    <br />
                    <br />
                    with a few users submitted <b>10+</b> times in the system
                  </p>
                </InfoCard>
              </div>
            </div>
            <div className="matches-viz">
              <div className="insert-10">
                <div className="stats-subtitle">
                  How thirsty was your school?
                </div>
                <div className="stats-caption">
                  Using a super-secret method to calculate our proprietary
                  Thirst Index, a number based off the number of matches, search
                  matches, and crushes submitted, the thirstiest schools were
                  the Claremont Colleges, while NYU came in last.
                </div>
                <br />
                {isMobile ? <ThirstIndex /> : <ThirstIndexHorizontal />}
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

// need to access firestore data
export default firestoreConnect()(PageStats);
