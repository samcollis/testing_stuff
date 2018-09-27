//creating an array of ids to then join up together the to_ids
var idStringArray = [];

// extract the to_id from each object returned
//  push all the to_ids into an array, append with id= an join em with an &
const createQuerystring = (arrayOfIds) => {
  for(var i=0; i < arrayOfIds.length; i++) {
    idStringArray.push('id=' + arrayOfIds[i].to_id)
  }
  return idStringArray.join('&')
}

const getFollows = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: 'https://api.twitch.tv/helix/users/follows',
    params: {
        from_id: bundle.authData.user_id
    }
  });
  const parsed = z.JSON.parse(response.content).data;
  return parsed;
}

const getFollowsInfo = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: `https://api.twitch.tv/helix/users?${bundle.inputData.users}`,
  });
  const parsed = z.JSON.parse(response.content).data;
  return parsed;
}

// triggers on new following with a certain tag
const triggerNewfollowing = async (z, bundle) => {
    const follows = await getFollows(z, bundle);
    var userFollows = createQuerystring(follows)
    bundle.inputData.users = userFollows
    const users = await getFollowsInfo(z, bundle);
    return users;
}


module.exports = {
  key: 'new_following',
  noun: 'New following',

  display: {
    label: 'Get New Following',
    description: 'Triggers on a new new following.',
    hidden: true
  },

  operation: {
    inputFields: [
      
    ],
    perform: triggerNewfollowing,

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
