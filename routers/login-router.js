/* Import modules */
const express = require('express');
const login = express.Router();

/* At http://localhost:8080/ */

// Send the login page
login.get('/', function(req, res){

    // Send login.ejs to the user
    res.render("login");

});

/* Export login (router) for app.js to use */
module.exports = login;
