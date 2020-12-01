const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const flash = require('connect-flash')
const config = require('config')
const MongoDBStore = require('connect-mongodb-session')(session);
const {bindUserWithRequest} = require('./authMiddleware')
const setLocals = require('./setLocals')

let DB_ADMIN = "blog_project"
let DB_PASSWORD = "blog_project"

//database connected
const MONGODB_URL = `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@demo.erwyk.mongodb.net/blog_project?retryWrites=true&w=majority`

const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'session',
    expires:1000* 60* 60* 2
});

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session ({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
    
]

module.exports = app =>{
    middleware.forEach(m =>{
        app.use(m)
    })
}