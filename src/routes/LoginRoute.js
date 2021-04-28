const { Router } = require('express')
const Joi = require('joi')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { findUser } = require('../models/userModel')
const { checkCrypt } = require('../modules/bcrypt')
const { generateJWT } = require('../modules/jwt')


const LoginValidation = Joi.object({
  login: Joi.string()
    .required()
    .alphanum()
    .error(new Error("Login is incorrect")),
  password: Joi.string()
    .required()
    .error(new Error("Password isn't correct"))
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

const router = Router()

router.use(AuthMiddleware)

router.get('/', (req, res)=>{
  res.render('login',{
    title: 'Login Page'
  })
})

router.post('/', async(req,res)=>{
  try{
    let data = await LoginValidation.validateAsync(req.body)
    let user
    let phone_number = Number(data.login)
    if(isNaN(phone_number)){
     user = await findUser(data.login)
    }else{
      user = await findUser(phone_number)
    }

    if(!user) {
      throw new Error("User not found")
    }
    let isTrust = await checkCrypt(data.password, user.password)

    if(!isTrust){
      throw new Error("Password is incorrect")
    }
    let token = generateJWT({
      _id: user._id,
      name: user.name,
      username: user.username
    })
    res.cookie('token', token).redirect('/')
  }
  catch(e){
    res.render('login', {
      title: 'Log in',
      error: e + ""
    })
  }
})

module.exports = {
  path: "/login",
  router: router
}