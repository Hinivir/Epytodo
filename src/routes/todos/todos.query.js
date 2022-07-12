const not_found = require('../../middleware/notFound.js')

exports.query = function (sql, rest, con, res, callback) {
    con.query(sql, rest, function (err, result) {
        if (err) {
            res.type('json').status(500).send('{\n"msg": "Internal server error"\n}')
            return
        }
        if (!not_found.not_found(result, res))
            return callback(result)
    })
}
