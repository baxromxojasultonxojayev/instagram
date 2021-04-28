const {checkJWT} = require('../modules/jwt')


module.exports = async function(req,res, next){
  let token = req.cookies?.token
  token = checkJWT(token)
  if(token){
    req.user = token
  }
  next()
}