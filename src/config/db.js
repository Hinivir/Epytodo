const express = require('express');
const app = express();
const mysql = require('mysql2');
const env = require('dotenv');

env.config()

exports.db_connect = function db_connect() {
    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        database: process.env.MYSQL_DATABASE,
        password: process.env.MYSQL_ROOT_PASSWORD
    });
    return connection;
}
