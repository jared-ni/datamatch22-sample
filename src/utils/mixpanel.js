const mixpanel = require('mixpanel-browser');

mixpanel.init('23d4dfa4cbe9d673a77fe75573a2bdb8');

// let env_check = process.env.NODE_ENV === 'production';
let env_check = true;

let actions = {
  identify: id => {
    if (env_check) mixpanel.identify(id);
  },
  alias: id => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: props => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;
