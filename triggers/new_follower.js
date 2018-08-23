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

//            result.info = z.dehydrate(getFollowerInfo, { from_id: result.from_id } )
          }
          return followers
        })       
    };

  


module.exports = {
  key: 'new_follower',
  noun: 'follower',

  display: {
    label: "New Follower",
    description: 'Triggers when you receive a new follower'
  },


  operation: {
    inputFields: [
      
    ],
    perform: triggerNewfollower,

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
