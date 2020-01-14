const express = require('express')
const router = express.Router()
const slugify = require('slugify')

// models ----------------------------------------------------

// const mongoose = require('mongoose')
// const Post = mongoose.model('Post')
// const Profile = mongoose.model('Profile')
// const Note = mongoose.model('Note')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const Note = require('../../models/Note')

// validation ------------------------------------------------

const validatePost = require('../../validators/post')
const validateNotes = require('../../validators/notes')

// auth ------------------------------------------------------

const passport = require('passport')
const auth = passport.authenticate('jwt', { session: false })

// test route ------------------------------------------------

router.get('/test', (req, res) => res.json({ msg: 'posts route working.' }))

// home route ------------------------------------------------

// Preload post objects on routes with ':post'
router.param('post', (req, res, next, slug) => {
  Post.findOne({})
    .populate('author')
    .then(post => {
      if (!post) res.sendStatus(404)
      req.post = post
      next()
    }).catch(next)
})

//-----------------------------------------------------------------------

router.param('note', (req, res, next, id) => {
  Note.findById(id).then((note) => {
    if (!note) res.sendStatus(404)
    req.note = note
    next()
  }).catch(next)
})

router.get('/', auth, (req, res, next) => {

  var query = {}
  var limit = 20
  var offset = 0

  if (typeof req.query.limit !== 'undefined') limit = req.query.limit
  if (typeof req.query.offset !== 'undefined') offset = req.query.offset
  if (typeof req.query.tag !== 'undefined') query.tagList = { "$in": [req.query.tag] }

  Promise.all([
    req.query.author ? User.findOne({ handle: req.query.author }) : null,
    req.query.favorited ? User.findOne({ handle: req.query.favorited }) : null
  ])
    .then(function (results) {
      var author = results[0]
      var favoriter = results[1]

      if (author) query.author = author._id

      if (favoriter) {
        query._id = { $in: favoriter.favorites }
      } else if (req.query.favorited) {
        query._id = { $in: [] }
      }

      return Promise.all([
        Post.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: 'desc' })
          .populate('author')
          .exec(),
        Post.countDocuments(query).exec(),
        req.user ? User.findById(req.user.id) : null,
      ])
        .then(results => {
          var posts = results[0]
          var postsCount = results[1]
          var user = results[2]

          res.json(posts)
          res.json(postsCount)
          res.json(user)
        })
    })
    .catch(next)
})

// feed --------------------------------------------

router.get('/feed', auth, (req, res, next) => {

  var limit = 20
  var offset = 0

  if (typeof req.query.limit !== 'undefined') limit = req.query.limit
  if (typeof req.query.offset !== 'undefined') offset = req.query.offset

  User.findById(req.user.id)
    .then(user => {
      if (!user) return res.sendStatus(401)

      Promise.all([
        Post.find({ author: { $in: user.following } })
          .limit(Number(limit))
          .skip(Number(offset))
          .populate('author')
          .exec(),
        Post.countDocuments({ author: { $in: user.following } })
      ])
        .then(results => {
          var posts = results[0]
          var postsCount = results[1]
          res.json(posts)
          res.json(postsCount)
        })
        .catch(next)
    })
})

// get single post -------------------------------------------

router.get('/s/:id', (req, res) => {
  Post.findById(req.params.id)
    .populate('author', ['name', 'image', 'email'])
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nofound: 'nofound post' }))
})

// get all posts ---------------------------------------------

router.get('/g/allery', (req, res) => {

  Post.find()
    .sort({ date: -1 })
    .populate('user', ['name', 'image',])
    .then(posts => res.json(posts))
    .catch(err => {
      res.status(404).json({ nopostsfound: 'No posts found' })
    })
})

// create post -------------------------------------------

router.post('/', auth, (req, res, next) => {

  const { errors, isValid } = validatePost(req.body)
  if (!isValid) res.status(400).json(errors)

  const url = req.protocol + '://' + req.get('host') + req.originalUrl
  //const objectId = `obj_${req.body.category}`
  const slug = slugify(req.body.title, {
    replacement: '-',
    remove: null,
    lower: true
  })

  const postFields = {
    url: `${url}/${slug}`,
    slug: slug,
    streamId: req.body.streamId,
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    category: req.body.category,
    mediums: req.body.mediums.split(','),
    tags: req.body.tags.split(','),
    shareable: req.body.shareable,
    allow_notes: req.body.allow_notes,
    mature: req.body.mature,
    purchasable: req.body.purchasable,
    price: req.body.price,
    author: req.user.id
  }

  const newPost = new Post(postFields)

  newPost.save().then(post => res.json(post))
})

// update post -------------------------------------------

router.put('/u/:id', auth, (req, res, next) => {

  const { errors, isValid } = validatePost(req.body)
  if (!isValid) res.status(400).json(errors)

  const url = req.protocol + '://' + req.get('host') + req.originalUrl
  //const objectId = `obj_${req.body.category}`
  const slug = slugify(req.body.title, {
    replacement: '-',
    remove: null,
    lower: true
  })

  const postFields = {}
  postFields.author = req.user.id
  if (postFields.slug) postFields.slug = slug
  if (postFields.url) postFields.url = `${url}/${slug}`
  if (req.body.title) postFields.title = req.body.title
  if (req.body.content) postFields.content = req.body.content
  if (req.body.image) postFields.image = req.body.image
  if (req.body.category) postFields.category = req.body.category
  if (req.body.mediums) postFields.mediums = req.body.mediums.split(',')
  if (req.body.tags) postFields.tags = req.body.tags.split(',')
  if (req.body.shareable) postFields.shareable = req.body.shareable
  if (req.body.allow_notes) postFields.allow_notes = req.body.allow_notes
  if (req.body.mature) postFields.mature = req.body.mature
  if (req.body.purchasable) postFields.purchasable = req.body.purchasable
  if (req.body.price) postFields.price = req.body.price

  Post.findById({ _id: req.params.id }).then(() => {
    Post.findByIdAndUpdate({ _id: req.params.id }, { $set: postFields }, { new: true })
      .then(post => res.json(post))
      .catch(err => res.status(404).json({ nopost: `not posted: ${err}` }))
  })
})


// delete post -------------------------------------------

router.delete('/d/:id', auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.author.toString() !== req.user.id) {
            res.status(401).json({ noauth: 'noauth' })
          }
          post.remove().then(() => res.json({ success: 'post was removed' }))
        }).catch(err => { res.status(404).json({ nofound: 'nofound posts' }) })
    })
})

// get notes for a post -------------------

router.get('/:post/notes', (req, res) => {

  Post.findById(req.post.id)
    .populate({
      path: 'notes',
      populate: { path: 'author' },
      options: { sort: { createdAt: 'desc' } }
    })

    .then(notes => res.json(notes))

    .catch(err => res.status(404).json({
      nonotesfound: 'No notes found'
    }))
})

// add note -------------------------------

router.post('/:post/notes', auth, (req, res) => {

  const { errors, isValid } = validateNotes(req.body)
  if (!isValid) res.status(400).json(errors)

  Profile.findOne({ user: req.user.id })
    .then(profile => {

      Post.findById(req.post._id)
        .then(post => {

          const note = new Note({
            content: req.body.content,
            author: req.user.id,
            post: req.post
          })

          post.notes.unshift(note)
          post.save()
          note.save().then(post => res.json(post))
        })

        .catch(err => {
          res.status(404).json({ postnotfound: 'No post found' })
        })
    })
})

// update a note -------------------------------

router.put('/:post/notes/:note_id', auth, (req, res) => {
  const { errors, isValid } = validateNotes(req.body)
  if (!isValid) res.status(400).json(errors)
  const { note_id } = req.params
  if (!note_id) { res.json({ success: false, error: 'no id' }) }
  Note.findById(note_id, (error, note) => {
    if (error) res.json({ success: false, error })
    const { author, content } = req.body
    if (author) note.author = author
    if (content) note.content = content
    note.save(error => {
      if (error) res.json({ success: false, error })
      res.json({ success: true })
    })
  })
})


// remove a note -------------------------------

router.delete('/:post/notes/:note_id', auth, (req, res) => {

  Note.findById(req.params.note_id).then(note => {
    Note.findByIdAndDelete({ _id: req.params.note_id })
      .then(() => {

        Post.findById(req.post.id)
          .then((post) => {
            if (post.notes.filter(note =>
              note._id.toString() === req.params.note_id).length === 0
            ) {
              return res.status(404)
                .json({ note_does_not_exists: 'Note does not exist' })
            }

            const removeIndex = post.notes
              .map(item => item._id.toString())
              .indexOf(req.params.note_id)

            post.notes.splice(removeIndex, 1)

            post.save().then(post => res.json({ success: 'note was removed' }))
              .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
          })
      })
  })
})


// like posts ----------------------------------------

router.post('/like/:id', auth, (req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {

      Post.findById(req.params.id)
        .then(post => {

          if (post.likes.filter(like =>
            like.user.toString() === req.user.id).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' })
          }

          post.likes.unshift({ user: req.user.id })

          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
})

// unlike posts -------------------------------------

router.post('/unlike/:id', auth, (req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {

      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like =>
              like.user.toString() === req.user.id)
              .length === 0
          ) {

            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this post' })
          }

          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id)

          post.likes.splice(removeIndex, 1)
          post.save().then(post => res.json(post))
        })
        .catch(err => {
          res.status(404).json({ postnotfound: 'No post found' })
        })
    })
})

// favorite a post ---------------------------------------

router.post('/:post/favorite', auth, (req, res, next) => {
  var postId = req.post._id
  User.findById(req.user.id)
    .then(user => {
      if (!user) res.sendStatus(401)
      user.favs.push(postId)
      user.save().then(post => res.json(post))
    })
    .catch(err => {
      status(404).json({
        not_added: 'couldnt add to favorites'
      })
    })
})

// unfavorite a post -------------------------------------

router.delete('/:post/favorite', auth, (req, res, next) => {

  var postId = req.post._id

  User.findById(req.user.id)
    .then(user => {
      if (!user) { return res.sendStatus(401) }

      user.favs.pop(postId)
      user.save().
        //then(post => res.json(post))
        then(res.status(200).json({
          success: 'Post was removed from your favorites'
        }))
    })
    .catch(err => {
      status(404).json({
        error: 'couldnt remove from favorites'
      })
    })
})

module.exports = router
