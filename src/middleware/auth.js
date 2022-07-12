const express = require('express')
const jwt = require("jsonwebtoken");
const app = express()
const env = require('dotenv').config()

exports.auth = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.type('json').status(401).send('{\n"msg": "No token, authorization denied"\n}')
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.type('json').status(403).send('{\n"msg": "Token is not valid"\n}')
        req.user = user
        next(req, res)
    })
}
