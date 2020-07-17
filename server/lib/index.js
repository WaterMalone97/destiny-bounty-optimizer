const express = require('express');
const app = express();
const ServiceContext = require('./ServiceContext');

app.use(express.json());
app.set('port', (process.env.PORT || 8080));
let serviceContext = new ServiceContext();

const guardianRouter = require('./routes/guardian-routes');
const passThroughRouter = require('./routes/passthrough-routes');
app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname, '../../client', 'index.html'));
});

app.use('/guardian', function(req, res, next) {
    req.ctx = serviceContext;
    next();
 }, guardianRouter);

 app.use('/passthrough', function(req, res, next) {
    req.ctx = serviceContext;
    next();
 }, passThroughRouter);

app.listen(app.get('port'), () => console.log('Listening on port', app.get('port')));