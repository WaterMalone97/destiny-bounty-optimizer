const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    // let newReq = {
    //     uri: req.query.uri,
    //     qs: {
    //         id: req.query.id
    //     },
    //     method: 'GET'
    // }
    /* await new Promise((resolve, reject) => {
        request.get(newReq, (err, response, body) => {
            if (!response.error) {
                resolve(this);
            } 
            else {
                reject(err);
            }
        });
    }); */

    res.send(req.query.message);
});

module.exports = router;