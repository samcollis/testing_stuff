const authentication = require('./authentication');
const NewstreamonlineTrigger = require('./triggers/new_stream_online');
const FindgameTrigger = require('./triggers/find_game');
const NewfollowerTrigger = require('./triggers/new_follower');
const { getFollowerInfo } = require('./utils')


const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }
  return request;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,
  beforeRequest: [includeBearerToken],
  afterResponse: [],

  hydrators: {
    getFollowerInfo: getFollowerInfo
  },

  resources: {
  },

  triggers: {
    [NewfollowerTrigger.key]: NewfollowerTrigger,
    [FindgameTrigger.key]: FindgameTrigger,
    [NewstreamonlineTrigger.key]: NewstreamonlineTrigger,
  },

  searches: {
  },

  creates: {
  }
};

module.exports = App;
