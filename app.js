require('dotenv').config()
const express = require('express')
const mongooes = require('mongoose')
const config = require('config')
const chalk = require('chalk')

//imports routes
const setMiddleware = require('./middleware/middlewares')
const setRoutes = require('./routes/routes')

//palygrund routes
// const validatorRoutes =  require('./playground/validator')


const app = express()

console.log(config.get('name'))

//setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

//usng middleeare from middle directory
setMiddleware(app)

//using routes from route directory
setRoutes(app)


//404 error systems
app.use((req,res, next) =>{
     
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) =>{
    if(error.status == 404) {
        return res.render('pages/error/404', { flashMessage: {} })
    }
    console.log(chalk.red.inverse(error.message))
    console.log(error)
    res.render('pages/error/500', { flashMessage: {} })
})

let DB_ADMIN = "blog_project"
let DB_PASSWORD = "blog_project"

//database connected
const MONGODB_URL = `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@demo.erwyk.mongodb.net/blog_project?retryWrites=true&w=majority`


const PORT = process.env.PORT || 2020

mongooes.connect(MONGODB_URL,
{userNewUrlParser: true})

.then(() =>{
   
    console.log(chalk.green('Database Connected'))
    app.listen(PORT, () =>{
        console.log(`Server is running on PORT ${PORT}`)
    })
})
.catch(e =>{
    return console.log(e)
})