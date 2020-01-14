const router = require('express').Router()

router.use('/api', require('users'))
router.use('/api/tags', require('tags'))
router.use('/api/posts', require('posts'))
router.use('/api/notes', require('notes'))
router.use('/api/mediums', require('mediums'))
router.use('/api/profiles', require('profiles'))

module.exports = router