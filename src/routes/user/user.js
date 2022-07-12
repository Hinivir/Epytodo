const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const bcrypt = require("bcryptjs");
const query = require('./user.query.js')

exports.get_info_user = function (con, callback, res, id) {
    var sql = "SELECT * FROM user WHERE id =" + id
    query.query(sql, con, res, callback)
}

exports.get_todos_user = function (con, callback, res, id) {
    var sql = "SELECT * FROM todo WHERE user_id =" + id
    query.query(sql, con, res, callback)
}

exports.get_info_of_a_particular_user = function (con, infos, callback, res) {
    var mode = "email"
    if (Number.isInteger(Number(infos)))
        mode = "id"
    var sql = "SELECT * FROM user WHERE " + mode + " = " + infos
    query.query(sql, con, res, callback)
}

exports.update_infos = function (con, id, req, callback, res) {
    var email = req.body.email
    var name = req.body.name
    var firstname = req.body.firstname
    var password = bcrypt.hashSync(req.body.password, 10)
    if (email === undefined || name === undefined || firstname === undefined || password === undefined) {
        res.status(400).type('json').send('{"msg": "Bad parameter"}')
        return
    }
    var sql = "UPDATE user SET email = '" + email + "', name = '" + name + "', firstname = '" + firstname +
    "', password = '" + password + "' WHERE id = " + id
    query.query(sql, con, res, callback)
}

exports.delete_user = function (con, id, callback, res) {
    var sql = "SELECT * FROM user WHERE id = " + id
    query.query(sql, con, res, function (result) {
        sql = "DELETE FROM user WHERE id = " + id
        query.query(sql, con, res, callback)
    })
}
