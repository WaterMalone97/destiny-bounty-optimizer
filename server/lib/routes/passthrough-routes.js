const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // let req = {
    //     uri: req.query.uri,
    //     qs: {
    //         id: req.query.id
    //     },
    //     method: 'GET'
    // }

    res.send(req.query.message);
});

module.exports = router;