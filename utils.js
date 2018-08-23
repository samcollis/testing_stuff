

const getFollowerInfo = (z, bundle) => {
      return z.request({
        url: 'https://api.twitch.tv/helix/users',
        params: {
          id: bundle.inputData.from_id
        }  
        })
          .then(response => z.JSON.parse(response.content).data)
      };

module.exports = {
	getFollowerInfo
};