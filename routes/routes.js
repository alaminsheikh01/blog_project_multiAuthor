const authRoute = require('./authRoutes')
const dashboardRoute = require('./dashboardRoutes')
// const playgroundRoutes = require('../playground/play')
const uploadRoute = require('./uploadRoutes')
const postRoute = require('./postRoute')
const apiRoutes = require('../api/routes/apiRoutes')
const explorerRoute = require('./explorerRoutes')
const searchRoure = require('./searchRoute')
const authorRoutes = require('./authorRoute')


const routes =[
    {
        path:'/auth',
        handler: authRoute
    },
    {
        path: '/dashboard',
        handler: dashboardRoute
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/posts',
        handler: postRoute
    },
    {
        path:'/explorar',
        handler: explorerRoute
    },
    {
        path: '/search',
        handler: searchRoure
    },
    {
        path:'/author',
        handler: authorRoutes
    },
    {
        path: '/api',
        handler: apiRoutes
    },
    // {
    //     path: '/playground',
    //     handler: playgroundRoutes
    // },
    {
        path:'/',
        handler: (req, res) =>{
          res.redirect('/explorar')
        }
    }
]

module.exports = app =>{
      routes.forEach(r =>{
          if(r.path == '/') {
              app.get(r.path, r.handler)
          }else{
              app.use(r.path, r.handler)
          }
      })
}