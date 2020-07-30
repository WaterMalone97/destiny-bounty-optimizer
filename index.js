const express = require('express');
const path = require('path');
const ServiceContext = require('./ServiceContext');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

let serviceContext = new ServiceContext();

const devRouter = require ('./routes/dev-routes');

 app.use('/dev', function(req, res, next) {
   req.ctx = serviceContext;
   next();
}, devRouter);

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

 const port = process.env.PORT || 5000;
 app.listen(port);
 
 console.log('App is listening on port ' + port);