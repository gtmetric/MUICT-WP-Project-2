/* Import modules */
const dbConnection = require('../resources/dbConnection');


/* ---------- Database: User Management ---------- */
class UserMng{

    // List all users
    async listAll(){

        // Connect to the database
        let connection = await dbConnection();

        try {

            // Get all users from the database
            let sql = "SELECT user_info.id, user_info.fname, user_info.lname, user_info.bd, user_info.email, login_info.username " + 
                "FROM user_info JOIN login_info ON user_info.id = login_info.user_id";
            let results = await connection.query(sql);

            // For debug
            // console.log("From model");
            // console.log(JSON.stringify(results));

            // Return info of all users as a response
            return results;

        }
        catch (error) {
            console.log(error);
            throw error;
        } 
    }

    // Search for users
    async search(user_info){

        // For debug
        // console.log("From model");
        // console.log(user_info);
            
        // Connect to the database
        let connection = await dbConnection();

        // Search for user ID, firstname, lastname, or email
        try {

            // Get users from the search
            let sql = "SELECT user_info.id, user_info.fname, user_info.lname, user_info.bd, user_info.email, login_info.username " + 
            "FROM user_info JOIN login_info ON user_info.id = login_info.user_id " + 
            "WHERE (user_info.id = ? OR user_info.fname = ? OR user_info.lname = ? OR user_info.email = ?)";
            let results = await connection.query(sql, [user_info.id, user_info.fname, user_info.lname, user_info.email]); // Debug here
            
            // For debug
            // console.log("From model");
            // console.log(results);

            // Return info of the users from the search as a response
            return results;

        }
        catch (error) {
            console.log(error);
            throw error;
        } 

    }

    // Delete a user
    async delete(username){
        
        // Connect to the database
        let connection = await dbConnection();
        try {
            
            // Get the user's login info by the username
            let user = await connection.query("SELECT * FROM login_info WHERE username = ?", username);

            // For debug
            // console.log(user[0].user_id);

            // Delete the user's info from login_info table
            let sql = "DELETE FROM login_info WHERE username = ?";
            connection.query(sql, username, function(error, results) {
                if (error) throw error;

                // For debug
                // console.log(results.affectedRows);

            });

            // Delete the user's info from user_info table
            sql = "DELETE FROM user_info WHERE id = " + user[0].user_id;
            connection.query(sql, function(error, results) {
                if (error) throw error;

                // For debug
                // console.log(results.affectedRows);

            });

        }
        catch (error) {
            console.log(error);
            throw error;
        } 
    }

    // Update info of a user
    async update(user_info){
        
        // Connect to the database
        let connection = await dbConnection();

        try {

            // Update info of a user in the database
            let sql = "UPDATE user_info SET ? WHERE id = ?";
            connection.query(sql, [user_info, user_info.id], function(error, results) {
                if (error) throw error;

                // For debug
                // console.log(results.affectedRows);

            });
        }
        catch (error) {
            console.log(error);
            throw error;
        } 
    }

    // Add a new user
    async add(info){
        
        // Connect to the database
        let connection = await dbConnection();

        try {
            
            // Add the user's info to user_info table
            let sql = "INSERT INTO user_info SET ?";
            connection.query(sql, [info.user_info], function(error, results) {
                if (error) throw error;

                // For debug
                // console.log(results.affectedRows);

            });

            // Add the user's info to login_info table
            sql = "INSERT INTO login_info SET ?";
            connection.query(sql, [info.login_info], function(error, results) {
                if (error) throw error;

                // For debug
                // console.log(results.affectedRows);

            });
        }
        catch (error) {
            console.log(error);
            throw error;
        } 
    }

}

/* Export UserMng (class) for admin-router to use */
module.exports = UserMng;