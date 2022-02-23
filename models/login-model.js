/* Import modules */
const fs = require('fs'); // For writing to JSON files
const adminJSON = require('../resources/data/admin.json'); // Import admin info from JSON
module.exports.adminJSON = adminJSON; // Export adminJSON for other people to use
const dbConnection = require('../resources/dbConnection');


/* ---------- Authentication ---------- */
class LoginInfo {

    // Authorize login
    async authorize(login_info) {

        // For debug
        console.log("From model");
        console.log(login_info);

        /* Authorization Pass */
        let auth_pass = false;
        // True: User has logged in.
        // False: User has not logged in.

        // Log in as User
        if(login_info.login_type=="user") {

            // Connect to the database
            let connection = await dbConnection();
            try {

                // Get all users from the database
                let sql = "SELECT * FROM login_info";
                let userJSON = await connection.query(sql);

                // For debug
                // console.log(results);

                // Check the username and password
                userJSON.forEach(function(user) {

                    // Find the username
                    if(login_info.login_info.username==user.username) {

                        // Check the password
                        if(login_info.login_info.password==user.password) {

                            // Log in successfully
                            auth_pass = true;

                            // Update last_login in the database
                            connection.query("UPDATE login_info SET ? WHERE username = ?", [login_info.login_info, user.username]);

                        }
                    }
                });

                // For debug
                // console.log(auth_pass);

            }
            catch (error) {
                console.log(error);
                throw error;
            } 
        }

        // Log in as Admin
        else if(login_info.login_type=="admin") {

            // Check the username and password
            adminJSON.forEach(function(admin) {

                // Find the user name
                if(login_info.login_info.username==admin.username) {

                    // Check the password
                    if(login_info.login_info.password==admin.password) {

                        // Log in successfully
                        auth_pass = true;

                        // Update last_login in JSON
                        admin.last_login = login_info.login_info.last_login;
                    }
                }
            });

            // For debug
            // console.log(adminJSON);

            // Write JSON back to the JSON file
            fs.writeFileSync('./resources/data/admin.json', JSON.stringify(adminJSON));

        }
        
        // Return the authorization pass as a reponse
        return auth_pass;

    }
 
}

/* Export LoginInfo (class) for admin-router and user-router to use */
module.exports.LoginInfo = LoginInfo;