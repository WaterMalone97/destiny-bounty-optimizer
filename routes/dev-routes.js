require('dotenv').config();

const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const request = require('request');

router.get('/callback', async (req, res) => {
    let code = req.query.code;
    let state = req.query.state;
    if (state !== process.env.REACT_APP_STATE) {
        console.log('Recieved callback from D2 API with unknown state. Ignoring...');
    }
    else {
        let tokenRequest = {
            uri: 'https://www.bungie.net/platform/app/oauth/token/',
            method: 'POST',
            body: {
                grant_type: 'authorization_code',
                code,
                client_id: process.env.REACT_APP_CLIENT_ID,
            }
        }

        try {
            let tokenResponse = await new Promise((resolve, reject) => {
                request.post(tokenRequest, (error, response, body) => {
                    if (response.statusCode === 200) {
                        resolve(body);
                    }
                    else {
                        console.log('ERROR REQUESTING TOKEN:', error);
                        reject(response);
                    }
                });
            });
            console.log(tokenResponse);
        }
        catch (error) {
            console.log(error);
        }
    }
});

router.get('/test', (req, res) => {
    let response = {
        text: "HI THIS IS A TEST"
    };
    res.json(response);
});

module.exports = router;