/* Import modules */
const express = require('express');
const admin = express.Router()

/* Import login-model for login authentication */
const LoginInfo = require('../models/login-model').LoginInfo;
const loginInfo = new LoginInfo();

/* Import admin-model for User Management System */
const UserMng = require('../models/admin-model');
const userMng = new UserMng();

/* Authorization Pass */
let auth_pass = false;  
// True: User has logged in.
// False: User has not logged in.


/* ---------- Admin Subsystem at http://localhost:8080/admin/ ---------- */

// Request to Log in as Admin
admin.post('/', async function(req, res){
    let login_info = req.body;

    // For debug
    // console.log("From router");
    // console.log(login_info);

    // Request to log in
    auth_pass = await loginInfo.authorize(login_info);

    // For debug
    // console.log(auth_pass);

    // Prepare the response
    let result = {"auth_pass": auth_pass};

    // Send the response back to the user
    return res.send({ error: false, data: result });

});

// Send the admin page to the user
admin.get('/', async function(req, res){;

    // If the user has not logged in, send the login page instead
    if(!auth_pass) {
        res.render("login"); // Send login.ejs to the user
    }
    else {
        res.render("admin"); // Send admin.ejs to the user
    }

});

// Add a new user
admin.post('/add', function (req, res) {
    let info = req.body;

    // For debug
    // console.log("From router");
    // console.log(info);

    // Return an error if the request is empty
    if (!info) {
        return res.status(400).send({ error: true });
    }

    // Request to add a new user
    userMng.add(info);

    // Return a response to tell that the new user has been added
    return res.send({ error: false });

});

// Update info of a user
admin.put('/update', function (req, res) {
    let id = req.body.id;
    let user_info = req.body;

    // For debug
    // console.log("From router");
    // console.log(user_info);

    // Return an error if the request is empty
    if (!id || !user_info) {
        return res.status(400).send({ error: true });
    }

    // Request to update the user's info
    userMng.update(user_info);

    // Return a response to tell that the info has been updated
    return res.send({ error: false });

});

// Delete a user
admin.delete('/delete', function (req, res) {
    let username = req.body.username;

    // Return an error if the request is empty 
    if (!username) {
        return res.status(400).send({ error: true });
    }

    // Request to delete a user
    let results = userMng.delete(username);

    // Return a response to tell that the user has been deleted
    return res.send({ error: false });

});

// Search for users
admin.post('/search', async function (req, res) {
    let user_info = req.body;

    // Return an error if the request is empty 
    if (!user_info) {
        return res.status(400).send({ error: true });
    }

    // Request to search for users
    let results = await userMng.search(user_info);

    // For debug
    // console.log("From router");
    // console.log(results);

    // Return the users from the search as a response
    return res.send({ error: false, data: results });

});

// List all users
admin.get('/listall', async function (req, res) {

    // Request for a list of all users
    let results = await userMng.listAll();

    // For debug
    // console.log("From router");
    // console.log(results);
    
    // Return a list of all users as a response
    return res.send({ error: false, data: results });
    
});

/* Export admin (router) for app.js to use */
module.exports = admin;