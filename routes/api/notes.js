const express = require('express')
const router = express.Router()

// test route ------------------------------------------------

router.get('/test', (req, res) => res.json({ msg: 'notes route works' }))

// return a list of notes -------------------------------------

router.get('/', function (req, res, next) {
  Post
    .find()
    .distinct('notes')
    .then(notes => res.json({ notes: notes }))
    .catch(next)
})

module.exports = router
