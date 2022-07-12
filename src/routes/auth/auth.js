const express = require('express')
const bcrypt = require("bcryptjs");
const db = require('../../config/db')
const index = require('../../index')

const con = db.db_connect()

function register_add_to_db(req, con, callback) {
    const email = req.body.email
    const name = req.body.name
    const firstname = req.body.firstname
    let password = req.body.password
    password = bcrypt.hashSync(password, 10)
    const sql = "INSERT INTO user (email, name, firstname, password) VALUES (?, ?, ?, ?)"
    con.query(sql, [[email], [name], [firstname], [password]], function(err, result) {
        if (err)
            throw err
        return callback(result.insertId)
    })
}

exports.register = (req, res) => {
    if (req.body.email === undefined || req.body.name === undefined || req.body.firstname === undefined || req.body.password === undefined) {
        res.status(400).type('json').send('{"msg": "Bad parameter"}')
        return
    }
    const email = req.body.email
    const sql = "SELECT * FROM user WHERE email = ?"
    con.query(sql, [email],  function (err, result) {
        if (err) throw err
        if (result.length === 0) {
            register_add_to_db(req, con, function(resu) {
                const token = index.generjwt({ id: resu })
                res.status(201).type('json').send('{\n"token": ' + token + '\n}')
            })
        } else {
            res.status(409).type('json').send('{"msg": "Account already exists"}')
        }
    })
}

exports.login = (req, res) => {
    if (req.body.email === undefined || req.body.password === undefined) {
        res.status(400).type('json').send('{"msg": "Bad parameter"}')
        return
    }
    const email = req.body.email
    let password = req.body.password
    const sql = "SELECT password, id FROM user WHERE email = ?"
    con.query(sql, [email], function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.status(401).type('json').send('{\n"msg": "Invalid Credentials"\n}')
            return
        }
        const stat = bcrypt.compareSync(password, result[0].password)
        if (stat === false)
            res.status(401).type('json').send('{\n"msg": "Invalid Credentials"\n}')
        else {
            const token = index.generjwt({ id:  result[0].id});
            res.status(201).type('json').send('{\n"token": "' + token + '"\n}');
        }
    })
}
