// config variables
const config = require('../config/app-config.js');

// express initialization
const express = require("express");
const app = express();



// set the view engine to ejs
app.set('view engine', 'ejs');

const helmet = require('helmet')
// required libraries
require('dotenv').config();
app.use(helmet())
app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "https: data:"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com']
      }
    })
  )

// static folder
app.use(express.static(config.root));

// routes
app.use('/', require('./main.js'))
app.use('/login', require('./login.js'))
app.use('/dashboard', require('./dashboard.js'))
app.use('/ajax', require('./ajax.js'))

// server initialization
app.listen(process.env.APP_PORT, () => console.log('Server is running'));
