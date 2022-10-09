import { css } from '@emotion/core';

export const pageStatsSx = {
  '.stats-select': {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '97% 60%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    borderRadius: '3px',
    boxSizing: 'border-box',
    marginLeft: '10px',
    marginTop: '5px',
    width: '220px',
    height: '36px',
    padding: '1px 10px 1px 10px',
    fontSize: '16px',
    fontWeight: '300',
  },

  '.multi-select': {
    width: '300px',
    fontSize: '16px',
    fontWeight: '300',
    marginLeft: '10px',
    height: '36px',
    boxSizing: 'border-box',
    borderRadius: '3px',

    '--rmsc-main': '#D7525B',
    '--rmsc-hover': '#F4F2F2',
    '--rmsc-selected': '#F5E3E3',
    '--rmsc-border': '#B1B1B1',
    '--rmsc-gray': 'black',
    '--rmsc-bg': 'white',
    '--rmsc-radius': '3px' /* Radius */,
    '--rmsc-h': '36px' /* Height */,
  },

  '.dropdown-content input[type=checkbox]': {
    width: '15px',
  },

  '.select-item': {
    height: '48px',
    verticalAlign: 'top',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBotton: 0,
  },

  '.tooltip': {
    fontSize: '12px',
  },

  svg: {
    overflow: 'visible',
  },
};

export const pageStatsStyle = css`
  .show-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .users-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
  }
  .schools-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .matches-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .stats-header {
    letter-spacing: 0.05em;
    margin-bottom: 0.1em;
    text-align: center;
  }
  .stats-display {
    margin-top: 20px;
  }
  .cards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
  .cards > * {
    margin-top: 20px;
  }
  .school-demo-viz {
    margin-top: 50px;
  }
  .matches-viz-grid {
    flex-direction: column;
  }
  .matches-school {
    grid-area: school;
    justify-self: left;
  }
  .matches-profile {
    grid-area: profile;
    justify-self: left;
  }
  .matches-year {
    grid-area: year;
    justify-self: left;
  }
  .stats-button:hover: {
    background-color: pink;
    color: white;
  }

  .stats-button: {
    background-color: lightPink;
    color: primary;
  }

  .stats-button, .stats-button:hover: {
    border-width: 1px;
    border-style: solid;
    border-color: primary;
    border-radius: 3px;
    padding: 5px 10px;
    text-decoration: none;
    margin-right: 15px;
  }
  .header-text {
    margin-bottom: 10px;
    background-color: rgba(249, 169, 165, 0.5);
    padding: 10px;
  }
  #footer-text p {
    text-align: center;
    margin: auto;
  }

  .stats-title {
    font-size: 24px;
    margin-bottom: 5px;
  }
  .stats-subtitle {
    font-size: 20px;
    margin-bottom: 5px;
  }
  .stats-caption {
    font-size: 16px;
    margin-bottom: 5px;
  }
  .row-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .column-container {
    display: flex;
    flex-direction: column;
  }
  .stats-spacer {
    margin-top: 15px;
  }
  .insert-1 {
    width: 500px;
    min-height: 330px;
    padding: 15px;
  }
  .insert-2 {
    width: 300px;
    min-height: 260px;
    margin-top: 20px;
    padding: 15px;
  }
  .insert-3 {
    width: 400px;
    min-height: 610px;
    margin-left: 20px;
    padding: 15px;
  }
  .insert-11 {
    min-width: 500px;
    min-height 30%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    padding: 15px;
  }
  .insert-4 {
    width: 100%;
    min-height 30%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 15px;
  }
  .insert-5 {
    width: 45%;
    min-height: 300px;
    margin-top: 20px;
    padding: 15px;
  }
  .insert-6 {
    width: 45%;
    min-height: 200px;
    margin-top: 20px;
    margin-left: 20px;
    padding: 15px;
  }
  .insert-7 {
    width: 30%;
    min-height: 400px;
    margin-top: 20px;
    padding: 15px;
  }
  .insert-8 {
    min-width: 450px;
    min-height: 500px;
    padding: 15px;
  }
  .insert-9 {
    min-width: 450px;
    min-height: 330px;
    margin-left: 20px;
    padding: 15px;
  }
  .insert-10 {
    width: 95%;
    margin-top: 20px;
    margin-bottom: 70px;
    padding: 15px;
  }

  .insert-13 {
    width: 400px;
    min-height: 610px;
    margin-left: 20px;
    padding: 15px;
  }
  .insert-12 {
    width: 75%;
    min-height: 400px;
    min-width: 400px;
    margin-top: 20px;
    padding: 15px;
  }
  @media only screen and (max-width: 800px) {
    .users-container {
      flex-direction: column;
    }
    .row-container {
      flex-direction: column;
    }
    .stats-title {
      font-size: 14px;
    }
    .stats-subtitle {
      font-size: 12px;
    }
    .stats-caption {
      font-size: 10px;
    }
    .insert-1 {
      width: 280px;
      min-height: 260px;
      padding: 10px;
    }
    .insert-2 {
      width: 280px;
      min-height: 200px;
      padding: 10px;
    }
    .insert-3 {
      width: 280px;
      min-height: 610px;
      margin-top: 20px;
      margin-left: 0px;
      padding: 10px;
    }
    .insert-4 {
      margin-top: 20px;
      margin-bottom: 20px;
      min-width: 90%;
      min-height 30%;
      padding: 10px;
    }
    .insert-5 {
      width: 280px;
      min-height: 300px;
      margin-top: 20px;
      padding: 10px;
    }
    .insert-6 {
      width: 280px;
      min-height: 180px;
      margin-top: 20px;
      margin-left: 0px;
      padding: 10px;
    }
    .insert-7 {
      width: 280px;
      min-height 160px;
      margin-top: 20px;
      padding: 10px;
    }
    .insert-8 {
      min-width: 280px;
      min-height: 240px;
      margin-top: 20px;
      padding: 10px;
    }
    .insert-9 {
      min-width: 280px;
      min-height: 330px;
      margin-left: 0px;
      margin-top: 20px;
      padding: 10px;
    }
    .insert-10 {
      min-width: 280px;
      margin-top: 20px;
      padding: 10px;
    }
    .insert-11 {
      width: 280px;
      min-height 160px;
      margin-top: 20px;
      padding: 10px;
    }
    .insert-12 {
      min-width: 280px;
      min-height: 300px;
      margin-top: 20px;
      padding: 10px;
    }
    .insert-13 {
      width: 0px;
      min-height: 0px;
      margin-left: 20px;
      padding: 10px;
    }
  }
`;
