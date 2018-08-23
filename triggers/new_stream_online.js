/* const _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
const crypto = require('crypto'); */


// triggers on new stream online with a certain tag
const triggerNewStreamOnline = (z, bundle) => {
    
let streams = [];  // start with an empty array
let res = ''
let cursor = ''

    function streamerVsPopThreshold(streamer, popularity) {   // if streamer and a pop threshhold is selected want to respect that 
      if(streamer && !popularity) {
        bundle.inputData.popularity_threshold = 0
      }
      if(!streamer && popularity) {
        bundle.inputData.popularity_threshold = bundle.inputData.popularity_threshold
      }
      if(!streamer && !popularity) {
        bundle.inputDat.popularity_threshold = 500
      }
      else {
        bundle.inputData.popularity_threshold = bundle.inputData.popularity_threshold
      }
    }

    function new_stream_online_poll(res) {
      streams = streams.concat(res.data)
      var last = res.data[res.data.length -1]
      
      if(!bundle.inputData.popularity_threshold) {
        bundle.inputData.popularity_threshold = 500
      }

      streamerVsPopThreshold(bundle.inputData.streamer, bundle.inputData.popularity_threshold)


      if(!bundle.inputData.streamer && last.viewer_count > bundle.inputData.popularity_threshold) { 
        // if a streamer is selected, we'll never need to paginate since we'd only expect 1 result to return
        cursor = res.pagination.cursor
        return makeRequest(cursor); 
      } 
      else {
        // need to filter the results so that I only ever return streams above the popularity threshold
        return streams.filter(stream => stream.viewer_count > bundle.inputData.popularity_threshold);
      }
    };


  const makeRequest = (cursor) =>  {
    const params = {
      language: bundle.inputData.language
    };

    if(cursor) {
      params.after = cursor
    };

    if(bundle.inputData.game) {
      params.game_id = bundle.inputData.game
    };
    if(bundle.inputData.streamer) {
      params.user_login = bundle.inputData.streamer
    };

    return z.request({
    url: 'https://api.twitch.tv/helix/streams',
    params: params
    })
    .then(response => {
      res = z.JSON.parse(response.content)
      return new_stream_online_poll(res);
    });
  
  }


   return makeRequest()
    

};

module.exports = {
  key: 'new_stream_online',
  noun: 'stream',

  display: {
    label: 'New Stream Online',
    description: 'Triggers on a new stream online.',
    hidden: false,
    important: true
  },

  operation: {
    inputFields: [
      {
        key: 'game',
        label: 'Game',
        helpText: 'Select a Game from the top 20 most popular',
        required: false,
        dynamic: 'find_game.id.name'
      },
      {
        key: 'streamer',
        label: 'Streamer',
        required: false,
        type: 'string'
      },
      {
        key: 'language',
        label: 'Language',
        type: 'string',
        required: false,
        choices: {
          en: 'English',
          nl: 'Dutch',
          de: 'German',
          hu: 'Hungarian',
          it: 'Italian',
          fr: 'French',
          es: 'Spanish; Castilian',
          pl: 'Polish',
          ru: 'Russian',
          bg: 'Bulgarian',
          ar: 'Arabic',
          th: 'Thai',
          zh: 'Chinese',
          ja: 'Japanese',
          ko: 'Korean'         
        }
      },
      {
        key: 'popularity_threshold',
        label: 'Popularity Threshold',
        helpText: 'Select the minimum amount of viewers for a stream if nothing is slected 500 will be the default',
        type: 'integer',
        required: false,
      }

      
    ],

    sample: {
      id: 1,
      name: 'Test'
    },

    outputFields: [
      {
        key: 'community_ids',
        type: 'string'
      },
      {
        key: 'game_id',
        type: 'string'
      },
      {
        key: 'id',
        type: 'string'
      },
      {
        key: 'language',
        type: 'string'
      },
      {
        key: 'started_at',
        type: 'string'
      },
      {
        key: 'thumbnail_url',
        type: 'string'
      },
      {
        key: 'title',
        type: 'string'
      },
      {
        key: 'type',
        type: 'string'
      },
      {
        key: 'user_id',
        type: 'string'
      },
      {
        key: 'viewer_count',
        type: 'string'
      }
    ],
    perform: triggerNewStreamOnline
  } 
};
