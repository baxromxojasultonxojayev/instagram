const client = require('../modules/mongo')
const Schema = require('mongoose').Schema

const FoolowerSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId
  },
  follow_user: {
    type: Schema.Types.ObjectId
  }
})

async function followerModel () {
  let db = await client()
  return await db.model('follower', FoolowerSchema)
}

async function addFollower(user_id, follow_user){
  let db = await followerModel()
  return await db.create({user_id : user_id, follow_user : follow_user})
}


async function deleteFollower(user_id, follow_user){
  let db = await followerModel()
  return await db.deleteOne({user_id : user_id, follow_user : follow_user})
}

async function myFollowings(user_id){
  let db = await followerModel()
  return await db.find({user_id : user_id})
}
async function myFollowers(user_id){
  let db = await followerModel()
  return await db.find({follow_user : user_id })
}
module.exports = {
  addFollower, deleteFollower, myFollowings, myFollowers
}