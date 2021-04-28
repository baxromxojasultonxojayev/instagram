const { Router, request } = require('express')
const { createUser, updateDate } = require('../models/userModel')
const { generateCrypt } = require('../modules/bcrypt')
const { generateJWT } = require('../modules/jwt')
const AuthMiddleware = require('../middleware/AuthMiddleware')

const router = Router()
const Joi = require('joi')

router.use(AuthMiddleware)

router.use(async (req,res, next)=>{
  if(req.user){
    res.redirect('/')
    return 0
  }
  next()
})

const RegistrationValidation = new Joi.object({
  phone: Joi.number()
    .min(10000)
    .max(999999999999999)
    .error(new Error("Phone number isn't correct"))
    .required(),
  name: Joi.string()
    .min(3)
    .max(32)
    .error(new Error("Name isn't correct"))
    .required(),
  username: Joi.string()
    .alphanum()
    .min(6)
    .max(16)
    .error(new Error("Username isn't correct"))
    .required(),
  password: Joi.string()
    .min(6)
    .max(32)
    .error(new Error("Password isn't correct"))
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
})

const BirthDate = new Joi.object({
  bmonth: Joi.string()
    .required()
    .error(new Error('Write Birth month'))
    .trim(),
  bday: Joi.number()
    .required()
    .error(new Error('Write Birth Day'))
    .min(1)
    .max(31),
  byear: Joi.number()
    .required()
    .error(new Error('Write Birth Year'))
    .min(1930)
    .max(2016)
})

router.get('/', (req, res)=>{
  res.render('registration', {
    title: 'SignUp page'
  })
})

router.post('/', async (req, res) =>{
  try{
    const { phone, name, username, password } = await RegistrationValidation.validateAsync(req.body)
    const user = await createUser(phone, name, username, generateCrypt(password))
    let token = generateJWT({
      _id: user._id,
      name: user.name,
      username: user.username
    })
    res.cookie('token', token).redirect('/signup/bdate')
  }
  catch(e){
    if(String(e).includes("duplicate key")){
      e = "Username or Phone has already existed"
    }
    res.render('registration', {
      title: "SignUp",
      error: e + ""
    })
  }

})

router.get('/bdate', AuthMiddleware, async(req,res)=>{
  res.render('bdate', {
    title: "BirthDate Page"
  })
})

router.post('/bdate', AuthMiddleware, async (req,res) =>{
  try{
    let data = await BirthDate.validateAsync(req.body)
    let update = await updateDate(req.user._id, data)
    res.redirect('/')
  }
  catch(e){
    res.render('bdate', {
      title: "BirthDate Page",
      error: e + ""
    })
  }
})

module.exports = {
  path: "/signup",
  router: router
}