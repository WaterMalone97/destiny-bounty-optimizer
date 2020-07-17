const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', async (req, res) => {
    let message = req.query.message;
    let newReq = {
        uri: 'https://destiny-bounty-optimizer.herokuapp.com/passthrough',
        qs: {
            uri: 'd2api.com/guardian',
            message
        },
        method: 'GET'
    }

    await new Promise((resolve, reject) => {
        request.get(newReq, (err, response, body) => {
            if (!response.error) {
                resolve(this);
            } 
            else {
                reject(err);
            }
        });
    });

    res.send(res.body)
});

module.exports = router;