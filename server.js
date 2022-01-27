const express = require('express');
const app = express();
const cors = require('cors');

//Helmet
const helmet = require("helmet");

// Load the path module to be used in the deployment configuration below.
const path = require('path');

// Load the routes file to be able to use it
const serverRouter = require('./routes/index');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

//Use the routes
app.use('/api', serverRouter);

// Heroku Deployment Configuration - NB this has to be below the routes to avoid bugs in production.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

//Error handling
app.get('*', function (req, res, next) {
  let err = new Error();

  // Set the status code to 404
  err.statusCode = 404;

  /* In order to enable our middleware to redirect we 
  set the shouldRedirect property on the err object to true. */
  err.shouldRedirect = true;
  next(err);
});

// Error handling middleware
app.use(function (err, req, res, next) {
  res.status(500).send('Oops something is wrong!');
});

// Set the dynamic port.
const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log(`App server is listening on PORT ${PORT}`);
});