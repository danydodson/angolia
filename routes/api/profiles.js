const express = require('express')
const router = express.Router()

// models ----------------------------------------------------

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// validation ------------------------------------------------

const validateProfile = require('../../validators/profile')

// auth ------------------------------------------------------

const passport = require('passport')
const auth = passport.authenticate('jwt', { session: false })

// test route ------------------------------------------------

router.get('/test', (req, res) => res.json({ msg: 'profile route works' }))

// get all profiles ------------------------------------------

router.get('/gallery', (req, res) => {
  const errors = {}
  Profile.find()
    .populate('user', ['name', 'image'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles'
        return res.status(404).json(errors)
      }
      res.json(profiles)
    })
    .catch(err => {
      res.status(404).json({ profile: 'There are no profiles' })
    })
})

// get current profile ---------------------------------------

router.get('/:handle', auth, (req, res) => {
  const errors = {}
  Profile
    .findOne({ handle: req.params.handle })
    //.findOne({ user: req.user.id })
    .populate('user', ['name', 'image'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// create or edit profile ------------------------------------

router.post('/:handle', auth, (req, res) => {

  const { errors, isValid } = validateProfile(req.body)

  if (!isValid) res.status(400).json(errors)

  const profileFields = {}
  profileFields.user = req.user.id
  profileFields.handle = req.user.handle
  profileFields.image = req.user.image
  if (req.body.website) profileFields.website = req.body.website
  if (req.body.location) profileFields.location = req.body.location
  if (req.body.bio) profileFields.bio = req.body.bio
  if (req.body.status) profileFields.status = req.body.status
  //if (req.file.filename) profileFields.src = req.file.filename
  if (req.body.mediums) profileFields.mediums = req.body.mediums.split(',')

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.json(profile))
    } else {

      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = 'That handle already exists'
          res.status(400).json(errors)
        }

        new Profile(profileFields).save().then(profile => res.json(profile))
      })
    }
  })
})

// delete user and profile -----------------------------------

router.delete('/:handle', auth,
  (req, res) => {
    Profile.findOneAndRemove({ handle: req.params.handle })
      .then(() => res.status(404).json({ success: 'profile removed' }))
  }
)

module.exports = router