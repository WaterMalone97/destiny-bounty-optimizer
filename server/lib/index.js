const express = require('express');
const app = express();
const ServiceContext = require('./ServiceContext');

app.use(express.json());
app.set('port', (process.env.PORT || 8080));
let serviceContext = new ServiceContext();

const guardianRouter = require('./routes/guardian-routes');
app.use('/guardian', function(req, res, next) {
    req.ctx = serviceContext;
    next();
 }, guardianRouter);

app.listen(app.get('port'), () => console.log('Listening on port', app.get('port')));