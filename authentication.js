const getUserId = (z, AccessToken) => {
  const promise = z.request({
    headers: {
      Authorization: `Bearer ${AccessToken}`
    },
    method: 'GET',
    url: `https://api.twitch.tv/helix/users`,
  });
  return promise.then((response) => {
    if (response.status === 401) {
      throw new Error('The access token you supplied is not valid');
    }
    return response;
  });
}


const getAccessToken = (z, bundle) => {
  const promise = z.request(`${process.env.BASE_URL}/oauth2/token`, {
    method: 'POST',
    body: {
      code: bundle.inputData.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: '{{bundle.inputData.redirect_uri}}'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  return promise.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }
    const result = JSON.parse(response.content);

    return getUserId(z, result.access_token)
        .then(userIdResponse => {
          const userIdResult = JSON.parse(userIdResponse.content).data[0]
          return {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            user_id: userIdResult.id
                };
         });
    });
  };

const refreshAccessToken = (z, bundle) => {
    const promise = z.request(`${process.env.BASE_URL}/oauth2/token`, {
    method: 'POST',
    body: {
      refresh_token: bundle.authData.refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  
  return promise.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }

    const result = JSON.parse(response.content);
    return {
      access_token: result.access_token
    };
  });
};


const testAuth = (z) => {

  const promise = z.request({
    method: 'GET',
    url: `https://api.twitch.tv/helix/users`,
  });
  // this is to grab the display_name from within the data array
  
  return promise.then((response) => {
    if (response.status === 401) {
      throw new Error('The access token you supplied is not valid');
    }
    const result = JSON.parse(response.content);
    console.log(result);
    return result.data[0];
      });
};

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: {
      method: 'GET',
      url: `https://www.humanity.com/`,
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code'
      }
    },
    
    getAccessToken: getAccessToken,
    
    refreshAccessToken: refreshAccessToken,
    
    autoRefresh: true,
    
    scope: 'user:edit'
  },
  fields: [{
    key: 'user_id',
    type: 'string',
    required: false,
    computed: true
    }],
  
  test: testAuth,
  
  connectionLabel: '{{display_name}}'
};
