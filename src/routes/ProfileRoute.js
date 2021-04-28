const {
  Router
} = require('express')
const UserMiddleware = require('../middleware/UserMiddleware')
const upload = require('express-fileupload')
const fs = require('fs/promises')
const fsOld = require('fs')
const path = require('path')
const {findUser} = require('../models/userModel')
const { myFollowers } = require('../models/followerModel')

const router = Router()

router.use(UserMiddleware)



router.get('/', UserMiddleware, async (req, res) => {
  let user = await findUser(req.user.username)
  let followers = await myFollowers(req.user._id)
  console.log(followers);
  const photoPath = path.join(__dirname, "..", "public", "avatar", `${req.user._id}.jpg`)
  let isExist = fsOld.existsSync(photoPath)
  console.log(isExist);
  res.render('index', {
    title: 'Homepage',
    photo: isExist,
    user: user
  })
})

router.post('/photo', upload(1024 * 10 * 1024), async (req, res) => {
  try {
    const photoPath = path.join(__dirname, "..", "public", "avatar", `${req.user._id}.jpg`)
    const fileStream = await fs.writeFile(photoPath, req.files.photo.data)
    console.log(fileStream);
    res.send({
      ok: true
    })
  }
  catch(e){
    console.log(e);
    res.send({
      ok: false
    })
  }
})




module.exports = {
  path: "/profile",
  router: router
}