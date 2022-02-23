const mysql = require('promise-mysql');
const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}

module.exports = async () => {
    try {
        let pool = await mysql.createPool(dbConfig);
        let connection = pool.getConnection();

        return connection;
    } 
    catch (error) {
        throw error;
    }
}