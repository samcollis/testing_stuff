// triggers on new streamer online with a certain tag
const triggerNewstreameronline = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://api.twitch.tv/helix/streams',
    params: {
      user_login: bundle.inputData.streamer
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).data);
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
        helpText: "You'll want to use the streamer's Twitch name in this field. For example, If your streamer's URL is `https://www.twitch.tv/magic`, use magic",
        required: false,
        type: 'string'
      },
      
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
