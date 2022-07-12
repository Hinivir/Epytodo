const express = require('express')
const app = express()
const not_found = require('../../middleware/notFound.js')

exports.query = function (sql, con, res, callback) {
    con.query(sql, function (err, result) {
        if (err) {
            res.type('json').status(500).send('{\n"msg": "Internal server error"\n}')
            return
        }
        if (!not_found.not_found(result, res))
            return callback(result)
    })
}
