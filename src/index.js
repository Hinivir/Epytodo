const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const auth = require('./routes/auth/auth.js')
const db = require('./config/db.js')
const td = require('./routes/todos/todos.js')
const user = require('./routes/user/user.js')
const env = require('dotenv');
const mid_auth = require('./middleware/auth.js')

const connection = db.db_connect()

env.config()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// body-parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//jwt

exports.generjwt = function generateAccessToken(id) {
    return jwt.sign(id, process.env.SECRET, { expiresIn: '1800s' });
}

//register

app.post('/register', auth.register)

//login

app.post('/login', auth.login)

//add todo
app.post('/todos', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        td.new_todo(req, connection, res, function (result) {
            td.show_latest(res, connection, function (result) {
                res.type('json').status(200).send(result[0])
            })
        })
    })
})

// update todo
app.put('/todos/:id', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        td.update_todo(req, req.params.id, connection, res, function (result) {
            td.show_id(res, connection, req.params.id, function (result) {
                    res.type('json').status(200).send(result[0])
            })
        })
    })
})

//delete todo
app.delete('/todos/:id', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        td.remove_todo(req.params.id, connection, res, function (result) {
            res.status(200).type('json').send('{"msg": "Successfully deleted record number : ' + req.params.id + '"\n}')
        })
    })
})

//show todo
app.get('/todos', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        td.show(res, connection, function (result) {
            res.type('json').status(200).send(result)
        })
    })
})

// show individual todos
app.get('/todos/:id', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        td.show_id(res, connection, req.params.id, function (result) {
            res.type('json').status(200).send(result[0])
        })
    })
})


//user

app.get('/user', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        user.get_info_user(connection, function (result) {
            res.type('json').status(200).send(result[0])
        }, res, req.user.id)
    })
})

app.get('/user/todos', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        user.get_todos_user(connection, function (result) {
            res.type('json').status(200).send(result)
        }, res, req.user.id)
    })
})

app.get('/users/:infos', (req, res) => {
        mid_auth.auth(req, res, (req, res) => {
            user.get_info_of_a_particular_user(connection, req.params.infos, function (result){
                res.type('json').status(200).send(result[0])
        }, res)
    })
})

app.put('/users/:id', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        user.update_infos(connection, req.params.id, req, function (result){
            user.get_info_of_a_particular_user(connection, req.params.id, function (result){
                res.type('json').status(200).send(result[0])
            }, res)
        }, res)
    })
})

app.delete('/users/:id', (req, res) => {
    mid_auth.auth(req, res, (req, res) => {
        user.delete_user(connection, req.params.id, function (result){
            res.type('json').status(200).send('{\n"msg": "Successfully deleted record number : ' + req.params.id + '"\n}')
        }, res)
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
