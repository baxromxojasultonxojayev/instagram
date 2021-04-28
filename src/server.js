const Express = require('express')
const CookieParesr = require('cookie-parser')
const Path = require('path')
const Fs = require('fs')
require('dotenv').config({path: Path.join(__dirname, ".env")})
const PORT = process.env.PORT

if(!PORT){
  throw new ReferenceError("PORT is not defined")
}

const application = Express()

// Middleware
application.use(Express.urlencoded({ extended: true }))
application.use(Express.json())
application.use(CookieParesr())
application.use(Express.static(Path.join(__dirname, "public")))

// Settings
application.listen(PORT)
application.set('view engine', 'ejs')
application.set('views', Path.join(__dirname,"/views"))

// Routes

application.get('/', (_, res) => res.render('index'))

const RoutesPath = Path.join(__dirname, "routes")

Fs.readdir(RoutesPath, (err, files)=>{
  if(err) throw new Error(err)
  files.forEach(route =>{
    const RoutePath = Path.join(__dirname, "routes", route)
    const Route = require(RoutePath)
    if(Route.path && Route.router) application.use(Route.path, Route.router)
  })
})


application.get('/', (_, res) =>{ res.redirect('/profile')})