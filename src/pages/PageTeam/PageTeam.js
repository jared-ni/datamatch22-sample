/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import { Mixpanel } from 'utils/mixpanel';

import TeamDeck from './TeamDeck';
import { Teams } from 'constants/Teams';
import Header from 'components/Header';

import { pageTeamSx } from './PageTeamStyles';

export default class PageTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamSelect: [false, false, false, false, false, false],
    };
  }

  componentDidMount() {
    // Web analytics
    Mixpanel.track('Team_Page', {});
    window.scrollTo(0, 0);
  }

  selectTeam = index => {
    let teamSelectCopy = this.state.teamSelect.map(_ => false);
    teamSelectCopy[index] = true;

    this.setState({
      teamSelect: teamSelectCopy,
    });
  };

  deselectTeam = () =>
    this.setState({
      teamSelect: this.state.teamSelect.map(_ => false),
    });

  renderPage = () => {
    const selectedIdx = this.state.teamSelect.findIndex(x => x);
    const selected = Teams[selectedIdx];

    // Create element that will display the teams that were not selected
    // both when no teams are clicked and when one team is clicked;
    // this element will go underneath the selected team
    const teamCovers = Teams.map((team, index) => {
      if (this.state.teamSelect[index]) {
        return null;
      }
      return (
        <div key={team.teamName}>
          <div className="team-header-container">
            <div
              className="team-box"
              onClick={() => this.selectTeam(index)}
              sx={team.teamName.length > 12 ? { fontSize: 3 } : {}}
            >
              {team.teamName}
            </div>
            {/* Redundant so underlay is the same size */}
            <div
              className="team-underlay"
              onClick={() => this.selectTeam(index)}
              sx={team.teamName.length > 12 ? { fontSize: 3 } : {}}
            >
              {team.teamName}
            </div>
          </div>
          <img
            alt="Card Back"
            className="team-cover"
            src={team.teamImg}
            onClick={() => this.selectTeam(index)}
            sx={{ cursor: 'pointer' }}
          />
        </div>
      );
    });

    return (
      <div>
        {selectedIdx !== -1 && (
          <div className="team-container">
            <div>
              <div className="team-header-container">
                <div
                  className="team-box"
                  onClick={this.deselectTeam}
                  sx={selected.teamName.length > 12 ? { fontSize: 3 } : {}}
                >
                  {selected.teamName}
                </div>
                {/* Redundant so underlay is the same size */}
                <div
                  className="team-underlay"
                  onClick={this.deselectTeam}
                  sx={selected.teamName.length > 12 ? { fontSize: 3 } : {}}
                >
                  {selected.teamName}
                </div>
              </div>
              <div>
                <TeamDeck
                  team={selected.members}
                  teamName={selected.teamName}
                  teamColor={selected.teamColor}
                  teamImg={selected.teamImg}
                />
              </div>
            </div>
          </div>
        )}
        <div className="team-container">{teamCovers}</div>
      </div>
    );
  };

  render() {
    return (
      <div sx={pageTeamSx} style={{ margin: '20px' }}>
        <Header>Meet the teams!</Header>
        <div>{this.renderPage()}</div>
      </div>
    );
  }
}
