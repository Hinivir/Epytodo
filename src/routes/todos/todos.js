const qr = require('./todos.query.js')

exports.new_todo = function new_todo(req, con, res, callback) {
    if (req.body.title === undefined || req.body.description === undefined || req.body.due_time === undefined || req.body.user_id === undefined) {
        res.status(400).type('json').send('{"msg": "Bad parameter"}')
        return
    }
    let title = req.body.title
    let description = req.body.description
    let dueTime = req.body.due_time
    let user_id = req.body.user_id
    let status
    if (req.body.status == null)
        status = 'not started'
    else
        status = req.body.status
    let sql = "INSERT INTO epytodo.todo (title, description, duetime, user_id, status) VALUES (?, ?, ?, ?, ?)"
    qr.query(sql, [[title], [description], [dueTime], [user_id], [status]], con, res, callback)
}

exports.update_todo = function update_todo(req, id, con, res, callback) {
    const sql_test = "SELECT * FROM epytodo.todo WHERE id = ?"
    qr.query(sql_test, id, con, res, function (result) {
        if (req.body.title === undefined || req.body.description === undefined || req.body.due_time === undefined || req.body.user_id === undefined || req.body.status === undefined) {
            res.status(400).type('json').send('{"msg": "Bad parameter"}')
            return
        }
        let title = req.body.title
        let description = req.body.description
        let dueTime = req.body.due_time
        let user_id = req.body.user_id
        let status = req.body.status
        let sql = "UPDATE epytodo.todo SET title = ?, description = ?, duetime = ?, user_id = ?, status = ? WHERE id = ?;"
        qr.query(sql, [[title], [description], [dueTime], [user_id], [status], [id]], con, res, callback)
    })
}

exports.remove_todo = function remove_todo(id, con, res, callback) {
    const sql_test = "SELECT * FROM epytodo.todo WHERE id = ?"
    qr.query(sql_test, id, con, res, function (result) {
        let sql = "DELETE FROM epytodo.todo WHERE id = (?)"
        qr.query(sql, id, con, res, callback)
    })
}

exports.show = function show(res, con, callback) {
    qr.query("SELECT * FROM todo;", [], con, res, callback)
}

exports.show_id = function show_id(res, con, id, callback) {
    qr.query("SELECT * FROM todo WHERE id = ?;", id, con, res, callback)
}

exports.show_latest = function show_latest(res, con, callback) {
    qr.query("select * from todo where create_at = (SELECT MAX(create_at) from todo)", [], con, res, callback)
}
