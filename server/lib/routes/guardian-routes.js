const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Spada Likes Eggs')
});

module.exports = router;