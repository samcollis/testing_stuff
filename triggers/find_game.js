const _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
const crypto = require('crypto');

const triggerFindgame = (z, bundle) => {
      return z.request({
      url: 'https://api.twitch.tv/helix/games/top'
    })
      .then(response => z.JSON.parse(response.content).data);

    };


module.exports = {
  key: 'find_game',
  noun: 'Find_game',

  display: {
    label: 'Get Find_game',
    description: 'Triggers on a new find_game.',
    hidden: true
  },

  operation: {
    inputFields: [
      {key: 'id', label: 'ID'}
    ],
    perform: triggerFindgame,

    sample: {
      id: 1,
      name: 'Test'
    },

    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'name', label: 'Name'}
    ]
  }
};
