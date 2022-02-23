/* Import modules */
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
dotenv.config();
app.use(bodyParser.json());

/* Deal with JSON and URL */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Set view engine to be rendered */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

/* Import routers of each module */
const login = require('./routers/login-router');
const user = require('./routers/user-router');
const admin = require('./routers/admin-router');

/* Route to the page per request */
app.use('/', login);
app.use('/user', user);
app.use('/admin', admin);

/* Set a port number for the server */
app.listen(process.env.PORT, function(){
    console.log('Listening at Port ' + process.env.PORT);
});