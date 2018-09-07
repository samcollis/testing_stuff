
const triggerNewStreamOnline = (z, bundle) => {

let streamDedupe = {}    
// let streams = []; 
let res = ''
let cursor = ''

if(!bundle.inputData.min_viewers) {
        bundle.inputData.min_viewers = 500
      }
// due to pagination we need to manually create an object using the ids as they keys to manually dedupe
// in the case an object spans more than 1 page due to rapidly changing viewership
    const makeObject = (streams) => {        
      for(var i=0; i < streams.length; i++) {
        streamDedupe[streams[i].id] = streams[i] // making that object
        streamDedupe[streams[i].id].thumbnail_url = streamDedupe[streams[i].id].thumbnail_url.replace("{width}x{height}", "1000x600")
      }
      return streamDedupe
    }


    function new_stream_online_poll(res) {
              
      var last = res.data[res.data.length -1]
      
      if(last.viewer_count > bundle.inputData.min_viewers) { 
        makeObject(res.data)
        cursor = res.pagination.cursor
        return makeRequest(cursor); 
      } 
      else {
        makeObject(res.data.filter(stream => stream.viewer_count > bundle.inputData.min_viewers))
           return Object.keys(streamDedupe).map(key => streamDedupe[key])
      }
    };


  const makeRequest = (cursor) =>  {
    const params = {
      first: 100      // we can grab the first 100 streams
    };

    if(cursor) {
      params.after = cursor
    };
    if(bundle.inputData.language) {
      params.language = bundle.inputData.language
    };

    if(bundle.inputData.game) {
      params.game_id = bundle.inputData.game
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
    description: 'Triggers when a new stream comes online.',
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
        key: 'min_viewers',
        label: 'Viewer Threshold',
        helpText: 'Select the minimum amount of viewers on a stream to trigger your Zap, if nothing is slected 500 will be the default',
        type: 'integer',
        required: false,
      }
      
    ],

    sample: {
      "id": "26007351216",
      "user_id": "7236692",
      "game_id": "29307",
      "community_ids": [
        "848d95be-90b3-44a5-b143-6e373754c382",
        "fd0eab99-832a-4d7e-8cc0-04d73deb2e54",
        "ff1e77af-551d-4993-945c-f8ceaa2a2829"
      ],
      "type": "live",
      "title": "[Punday Monday] Necromancer - Dan's First Character - Maps - !build",
      "viewer_count": 5723,
      "started_at": "2017-08-14T15:45:17Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_dansgaming-{width}x{height}.jpg"
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
