const express = require('express');
const router = express.Router();

router.get('/get', async (req, res) => {
  this._ctx = req.ctx;
  let token = await this._ctx.tokenHelper.grabToken();
  console.log(token)
  if (!token)
    res.status(404).json({msg: 'No token in database'})
  res.json(token)
})

router.get('/refresh', async (req, res) => {
  this._ctx = req.ctx;
  let token = await this._ctx.tokenHelper.refreshToken();
  console.log(token)
  if (!token)
    res.status(404).json({msg: 'Token refresh failed'})
  res.json(token)
})

module.exports = router;