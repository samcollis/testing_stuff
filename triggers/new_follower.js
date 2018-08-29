const { getFollowerInfo } = require('../utils')


const triggerNewfollower = (z, bundle) => {


  const responsePromise = z.request({
    url: `https://api.twitch.tv/helix/users/follows`,
    params: {
      to_id: bundle.authData.user_id
    },
  })
  return responsePromise
    .then(res => z.JSON.parse(res.content))
    .then(results => {
      var followers = results.data
      z.console.log(followers)
        for (let result of followers) {
            result.id = result.from_id;
            result.info = z.dehydrate(getFollowerInfo, { from_id: result.from_id } )
  //          const userInfo = z.dehydrate(getFollowerInfo, { from_id: result.from_id} )
  //          result = Object.assign(result, userInfo)
          }
          return followers
        })       
    };

  


module.exports = {
  key: 'new_follower',
  noun: 'follower',

  display: {
    label: "New Follower",
    description: 'Triggers when you receive a new follower',
    important: true
  },

  operation: {
    inputFields: [
      
    ],
    perform: triggerNewfollower,

    sample: {
    "id": "44322889",
    "login": "dallas",
    "display_name": "dallas",
    "type": "staff",
    "broadcaster_type": "",
    "description": "Just a gamer playing games and chatting. :)",
    "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-profile_image-1a2c906ee2c35f12-300x300.png",
    "offline_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-channel_offline_image-1a2c906ee2c35f12-1920x1080.png",
    "view_count": 191836881,
  },

    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'name', label: 'Name'},
      {key: 'display_name', label: "Display Name"}
    ]
  }
};
