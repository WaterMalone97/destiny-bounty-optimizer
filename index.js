require('dotenv').config();
const request = require('request');
const express = require('express');
const app = express();
const path = require('path');
const ServiceContext = require('./ServiceContext');

app.use(express.json());
app.set('port', (process.env.PORT || 5000));
let serviceContext = new ServiceContext();

const guardianRouter = require('./routes/guardian-routes');
const passThroughRouter = require('./routes/passthrough-routes');
const devRouter = require ('./routes/dev-routes');

app.use('/guardian', function(req, res, next) {
    req.ctx = serviceContext;
    next();
 }, guardianRouter);

 app.use('/dev', function(req, res, next) {
   req.ctx = serviceContext;
   next();
}, devRouter);

 app.use('/passthrough', function(req, res, next) {
    req.ctx = serviceContext;
    next();
 }, passThroughRouter);

 app.get('/callback', (req, res) => {
   
 });

app.listen(app.get('port'), () => console.log('Listening on port', app.get('port')));