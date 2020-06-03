const axios = require('axios');
const apiUrl = 'https://api.artsy.net/api/tokens/xapp_token';
let xappToken = '';

axios.post(apiUrl, {
    client_id: process.env.ARTSY_CLIENT_ID,
    client_secret: process.env.ARTSY_CLIENT_SECRET
  })
  .then(res => {
    xappToken = res.data.token;
    axios.get('https://api.artsy.net/api/artworks?sample=1', {
        headers: {
          'X-Xapp-Token': xappToken //the token is a variable which holds the token
        }
      })
      .then(function(res) {
        console.log(res.data);
      })
      .catch(function(err) {
        console.error(err);
      });
  })
  .catch(function(err) {
    console.error(err);
  });