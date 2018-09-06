const { getFollowerInfo } = require('../utils')

const params = {};

// let's make some better thumbnails
const fixThumbnail = (responseArray) => {
  for(i = 0; i < responseArray.length; i++) {
    responseArray[i].thumbnail_url = responseArray[i].thumbnail_url.replace("{width}x{height}", "1000x600")
  }
  return responseArray
}

// let's allow users to select multiple streamers seperate by a comma.
const seperateUsernames = (usernames) => {
    // username1,username2,username3,username4
    var streamersQuerystring = usernames.split(',')
    
    return streamersQuerystring.join('&user_login=')
}


// triggers on new streamer online with a certain tag
const triggerNewstreameronline = (z, bundle) => {
    var streamer = bundle.inputData.streamer
      if(streamer) {
        if(streamer.indexOf(',')) {//if there's a comma we want to seperate them
            var multiUsers = seperateUsernames(streamer);
            params.user_login = multiUsers
        } else {
        params.user_login = bundle.inputData.streamer
      }
  };
  if(bundle.inputData.streamerFollowed) {
    params.user_id = bundle.inputData.streamerFollowed
  };
  const responsePromise = z.request({
    url: `https://api.twitch.tv/helix/streams`,                      // we can't send params as an object so we'll ad em as a querystring directly,
    params:params
    
  });
  return responsePromise
    .then(response => {
      res = z.JSON.parse(response.content).data
      return fixThumbnail(res);
      })
    .then(results => {  //  and grab the user login for the streamer using the /users dehydrator
      var users = results
        for (let result of users) {
            result.id = result.user_id;
            result.info = z.dehydrate(getFollowerInfo, { from_id: result.user_id } )
          }
          return users
        })       
  };

module.exports = {
  key: 'new_streamer_online',
  noun: 'New streamer online',

  display: {
    label: 'New Streamer Online',
    description: 'Triggers when a specific stream begins',
    important: true
  },

  operation: {
    inputFields: [
    {
        key: 'streamer',
        label: 'Streamer Name',
        helpText: "Select multiple by seperating by a comma.  You'll want to use the streamer's Twitch name in this field. For example, If your streamer's URL is `https://www.twitch.tv/magic`, use magic",
        required: false,
        type: 'string'
      },
      {
        key: 'streamerFollowed',
        label: 'Streamer you Follow',
        helpText: 'Select from a list of streamers that you follow (note this will only work for up to 100)',
        required: false,
        dynamic: 'new_following.id.display_name',
        list: true
      }     
    ],
    perform: triggerNewstreameronline,

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
  }
};
