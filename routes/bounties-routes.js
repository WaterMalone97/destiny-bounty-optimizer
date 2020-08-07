const express = require('express');
const router = express.Router();

require('dotenv').config();

router.get('/', async (req, res) => {
    this._ctx = req.ctx;
    try {
        let vendorSales = await this._ctx.bountyHelper.getBounties();
        res.json(vendorSales);
    }
    catch(err) {
        console.log('ERROR GETTING BOUNTIES:', err)
        res.status(500);
    }
});

router.get('/rank', (req, res) => {
    console.log('Recieved bounty request');
    this._ctx = req.ctx;
    let bounty = this._ctx.bountyHelper.getUnevaluatedBounty();
    res.json(bounty);
});

router.post('/rank', async (req, res) => {
    console.log('Entering response for bounty', req.body.id);
    this._ctx = req.ctx;
    let time = req.body.time;
    let id = req.body.id;
    await this._ctx.bountyHelper.addBountyEvaluation(id, time);
    res.status(200).end();
});

module.exports = router;