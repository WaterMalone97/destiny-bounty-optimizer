require('dotenv').config();

const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const axios = require('axios');
const Token = require('../models/token');

router.get('/callback', async (req, res) => {
    let code = req.query.code;
    let state = req.query.state;
    if (state !== process.env.REACT_APP_STATE) {
        console.log('Recieved callback from D2 API with unknown state. Ignoring...');
    }
    else {
        let tokenRequest = {
            url: 'https://www.bungie.net/platform/app/oauth/token/',
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code,
                client_id: process.env.REACT_APP_CLIENT_ID,
                client_secret: process.env.client_secret
            })
        }

        try {
            let tokenResponse = await new Promise((resolve, reject) => {
                axios(tokenRequest)
                .then(res => {
                    const newToken = new Token({
                        token: res.data.access_token,
                        token_expire: res.data.expires_in,
                        refresh_token: res.data.refresh_token,
                        refresh_token_expire: res.data.refresh_expires_in
                    })
                    newToken.save();
                    console.log('Added token to db')
                    resolve(res.data);                    
                })
                .catch(err => {
                    console.log('ERROR REQUESTING TOKEN:', err.response)
                    reject(err.response)
                })
            });
            console.log(tokenResponse);
        }
        catch (error) {
            console.log(error);
        }
        res.redirect('https://destiny-bounty-optimizer.herokuapp.com')
    }
});

router.get('/test', (req, res) => {
    let response = {
        text: "HI THIS IS A TEST"
    };
    res.json(response);
});

module.exports = router;