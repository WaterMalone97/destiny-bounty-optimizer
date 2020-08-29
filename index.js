const express = require('express');
const path = require('path');
const ServiceContext = require('./ServiceContext');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

require('dotenv').config();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

const db = process.env.mongoURI

mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

let serviceContext = new ServiceContext();

const devRouter = require ('./routes/dev-routes');
const tokenRouter = require ('./routes/token-routes');
const bountiesRouter = require ('./routes/bounties-routes');
const supportRouter = require ('./routes/support-routes');

app.use('/dev', function(req, res, next) {
  req.ctx = serviceContext;
  next();
}, devRouter);

app.use('/token', function(req, res, next) {
  req.ctx = serviceContext;
  next();
}, tokenRouter);

app.use('/api/bounties', function(req, res, next) {
  req.ctx = serviceContext;
  next();
}, bountiesRouter);

app.use('/support', function(req, res, next) {
  req.ctx = serviceContext;
  next();
}, supportRouter);

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
 
console.log('App is listening on port ' + port);