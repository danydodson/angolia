const express = require('express')
const router = express.Router()

// test route ------------------------------------------------

router.get('/test', (req, res) => res.json({ msg: 'mediums route works' }))

// return a list of mediums -------------------------------------

router.get('/', function (req, res, next) {
  Post
    .find()
    .distinct('mediums')
    .then(mediums => res.json({ mediums: mediums }))
    .catch(next)
})

module.exports = router
