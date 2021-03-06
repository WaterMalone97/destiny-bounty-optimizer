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
        res.status(500).end();
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

router.post('/optimize', async (req, res) => {
    this._ctx = req.ctx;
    let minScore = parseInt(req.body.score);
    let filters = req.body.filters;
    try {
        let vendorSales = await this._ctx.bountyHelper.getBounties();
        let bountyArray = await this._ctx.bountyHelper.optimize(JSON.parse(JSON.stringify(vendorSales)), minScore, filters);
        res.json(bountyArray);
    }
    catch(err) {
        console.log('ERROR GETTING BOUNTIES:', err)
        res.status(500).end();
    }
});

router.get('/all', async (req, res) => {
    console.log('Grabbing all bounties in the game');
    this._ctx = req.ctx;
    let bounties = await this._ctx.bountyHelper.getAllBounties();
    res.json(bounties);
});

module.exports = router;