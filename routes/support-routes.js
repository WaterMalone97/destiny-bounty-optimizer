const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  this._ctx = req.ctx;
  let email = await this._ctx.supportHelper.sendEmail(req.body);
  if (!email)
    res.status(500).json({msg:'Failed to send'})
  res.json({msg: 'Message sent'})
})

module.exports = router;