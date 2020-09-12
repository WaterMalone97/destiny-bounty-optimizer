const Token = require('../models/token');
const axios = require('axios');
const querystring = require('querystring');

require('dotenv').config();

class TokenHelper {

  constructor(ctx) {
    this._ctx = ctx;
  }

  async refreshToken() {
    let entry = await Token.findOne()
    if (!entry)
      return console.log('token does not exist')

    const tokenRefresh = {
      url: 'https://www.bungie.net/platform/app/oauth/token/',
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: querystring.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.client_secret,
        refresh_token: entry.refresh_token
      })
    }

    let res;
    try {
      res = await axios(tokenRefresh)
      const newToken = {
        token: res.data.access_token,
        token_expire: res.data.expires_in,
        refresh_token: res.data.refresh_token,
        refresh_token_expire: res.data.refresh_expires_in
      }
      await Token.findOneAndUpdate({token: entry.token}, {...newToken})
      console.log('Updated token in db')
    }
    catch(err) {
      console.log('ERROR REFRESHING TOKEN:', err.response)
    }
    return res.data.access_token
  }

  async grabToken() {
    let entry = await Token.findOne()
    if (!entry)
      return console.log('No token in database')
    console.log(entry)
    return entry.token
  }
}

module.exports = TokenHelper;
