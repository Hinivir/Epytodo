const express = require('express')
const app = express()
const bodyParser = require('body-parser')

exports.not_found = function (result, res) {
    if (result.length === 0) {
        res.type('json').status(404).send('{\n"msg": "Not Found"\n}')
        return true
    }
    return false
}
