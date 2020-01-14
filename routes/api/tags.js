const express = require('express')
const router = express.Router()

// test route ------------------------------------------------

router.get('/test', (req, res) => res.json({ msg: 'tags route works' }))

// return a list of tags -------------------------------------

router.get('/', function (req, res, next) {
  Post
    .find()
    .distinct('tags')
    .then(tags => res.json({ tags: tags }))
    .catch(next)
})

module.exports = router
