const {checkJWT} = require('../modules/jwt')


module.exports = async function(req,res, next){
  let token = req.cookies?.token
  token = checkJWT(token)
  if(!token){
    res.redirect('/login')
    return 0
  }else{
    req.user = token
  }
  next()
}