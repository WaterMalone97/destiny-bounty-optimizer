const express = require('express');
const router = express.Router();
const axios = require('axios');

require('dotenv').config();

router.get('/', async (req, res) => {
    this._ctx = req.ctx;
    while(true) {
        try {
            let token = await this._ctx.tokenHelper.grabToken();
            let bountyRequest = {
                url: `https://www.bungie.net/Platform/Destiny2/${process.env.mem_type}/Profile/${process.env.member_id}/Character/${process.env.char_id}/Vendors/`,
                method: 'GET',
                headers: {
                    'X-API-Key': process.env.apiKey, 
                    'Authorization': 'Bearer ' + token
                },
                params: {
                    // Specifies the type of data bungie should give
                    components: 402
                }
            }
            let response = await axios(bountyRequest);
            console.log('Grabbed bounties')
            res.json(response.data.Response.sales)
            break;
        }
        catch(err) {
            //console.log('ERROR GETTING BOUNTIES:', err.response)
            if (err.response.status == 401) {
                console.log('Token expired, refreshing token')
                await this._ctx.tokenHelper.refreshToken();
            }
        }
    }
})

module.exports = router;