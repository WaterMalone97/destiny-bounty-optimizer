const express = require('express');
const router = express.Router();
const request = require('request');

// User.GetMembershipFromHardLinkedCredential
// Takes in steamID64
// Returns membershipType & membershipId

//membershipType: 3
//membershipId": 4611686018468606743

// Destiny2.GetProfile
// Takes in destinyMembershipId &  membershipType 
// Returns character data, possibly ids

//char id: 2305843009403059582

// Destiny2.GetVendors
// Takes in destinyMembershipId &  membershipType & character id
// Returns vendor data

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