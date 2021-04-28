const client = require('../modules/mongo')
const Schema = require('mongoose').Schema


const followerSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId
  }
})

const userSchema = new Schema({
  phone: {
    type: Number,
    index: true,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    index: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  bdate: {
    bmonth: {
      type: String
    },
    bday: {
      type: Number
    },
    byear: {
      type: Number
    }
  },
  followers: [followerSchema],
  following: []
})

async function userModel () {
  let db = await client()
  return await db.model('users', userSchema)
}

async function createUser(phone, name, username, password){
  const db = await userModel()
  return await db.create({
    phone, name, username, password
  })
}

async function updateDate(objectId, bdate){
  const db = await userModel()
  return await db.updateOne({_id: objectId}, { bdate })
}

async function findUser(login){
  let object = ((typeof login) == 'string') ? {username: login} : {phone: login }
  const db = await userModel()
  return await db.findOne(object)
}

// async function createUser (email, password) {
//   if(!(email && password)){
//     throw new ReferenceError("Email or Password is not found")
//   }
//   let model = await userModel()
//   let data = await model.create({email: email, password: password})
//   await data.save()
// }

module.exports = {
  createUser,
  updateDate,
  findUser
}