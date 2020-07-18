const express = require('express');
const app = express();
const path = require('path');
const ServiceContext = require('./ServiceContext');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))

app.use(express.json());
app.set('port', (process.env.PORT || 5000));
let serviceContext = new ServiceContext();

const guardianRouter = require('./routes/guardian-routes');
const passThroughRouter = require('./routes/passthrough-routes');

app.use('/guardian', function(req, res, next) {
    req.ctx = serviceContext;
    next();
 }, guardianRouter);

 app.use('/passthrough', function(req, res, next) {
    req.ctx = serviceContext;
    next();
 }, passThroughRouter);

 // Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname + '/client/build/index.html'))
 })

app.listen(app.get('port'), () => console.log('Listening on port', app.get('port')));