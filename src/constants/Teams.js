import web from 'assets/team_backs/web.png';
import business from 'assets/team_backs/business.png';
import design from 'assets/team_backs/design.png';
import statistics from 'assets/team_backs/statistics.png';
import algorithm from 'assets/team_backs/algorithm.png';
import campus from 'assets/team_backs/campus.png';
import teams from './teams.json';

export const Teams = [
  {
    teamName: 'Business',
    teamImg: business,
    teamColor: '#524f6c',
    members: teams['Business'],
  },
  {
    teamName: 'Web',
    teamImg: web,
    teamColor: '#8e8bad',
    members: teams['Web'],
  },
  {
    teamName: 'Design',
    teamImg: design,
    teamColor: '#dedef0',
    members: teams['Design'],
  },
  {
    teamName: 'Statistics',
    teamImg: statistics,
    teamColor: '#f5e3e3',
    members: teams['Statistics'],
  },
  {
    teamName: 'Algorithm',
    teamImg: algorithm,
    teamColor: '#ec9697',
    members: teams['Algorithm'],
  },
  {
    teamName: 'Campus Leads',
    teamImg: campus,
    teamColor: '#d7525b',
    members: teams['Campus Leads'],
  },
  {
    teamName: 'Campus Members',
    teamImg: campus,
    teamColor: '#d7525b',
    members: teams['Campus Members'],
  },
];
