// triggers when user receives a new folloer
const triggerNewfollower = (z, bundle) => {

  const responsePromise = z.request({
    url: `https://api.twitch.tv/helix/users/follows`,
    params: {
      to_id: bundle.authData.user_id
    },
  })
  return responsePromise
    .then(request => { //when we get a response back, we're gonna send another request to grab details on the user
      let res = z.JSON.parse(request.content).data[0].from_id
      return z.request({
        url: 'https://api.twitch.tv/helix/users',
        params: {
          id: res
        }
    })
      })
    .then(response => z.JSON.parse(response.content).data)

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
