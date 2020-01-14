const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

// models ----------------------------------------------------

const User = require('../../models/User')

// validation -----------------------------------------------------------------

const validateRegister = require('../../validators/register')
const validateLogin = require('../../validators/login')

// auth -----------------------------------------------------------------------

const passport = require('passport')
const auth = passport.authenticate('jwt', { session: false })

// test route -----------------------------------------------------------------

router.get('/test', (req, res) => res.json({ msg: 'users route works' }))

// view the currenlyt logged in user ------------------------------------------

router.get('/current', auth, (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      if (!user) res.sendStatus(401)
      res.json(user)
    })
    .catch(next)
})

// register a new user ---------------------------------------------------------

router.post('/register', (req, res) => {

  const {
    errors,
    isValid
  } = validateRegister(req.body)

  if (!isValid) res.status(400).json(errors)

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = 'email already exists'
        return res.status(400).json(errors)
      } else {

        const newUser = new User({
          name: req.body.name,
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash
            newUser.save()
              .then(user => res.json(user))
            //.catch(next)
          })
        })
      }
    })
})

// login route  --------------------------------------------------------------

router.post('/login', (req, res) => {

  const { errors, isValid } = validateLogin(req.body)

  if (!isValid) return res.status(400).json(errors)

  const email = req.body.email
  const password = req.body.password

  User.findOne({ email })
    .then(user => {
      if (!user) {
        errors.email = 'email not found'
        return res.status(404).json(errors)
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user._id,
              name: user.name,
              username: user.username
            }

            jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 },
              (err, token) => res.json({
                success: true, token: 'Bearer ' + token
              })
            )
          } else {
            errors.password = 'password incorrect'
            res.status(400).json(errors)
          }
        })
    })
})

// update current user  ----------------------------------------------------

router.put('/current', auth, (req, res, next) => {

  const { errors, isValid } = validateRegister(req.body)

  if (!isValid) res.status(400).json(errors)

  const newSettings = {}
  if (req.body.name) newSettings.name = req.body.name
  if (req.body.handle) newSettings.handle = req.body.handle
  if (req.body.email) newSettings.email = req.user.email
  if (req.body.password) newSettings.password = req.user.password
  if (req.body.password2) newSettings.password2 = req.user.password2

  User.findById({ _id: req.user.id })
    .then(user => {
      if (user) {
        User.findByIdAndUpdate(
          { _id: req.user.id },
          { $set: newSettings },
          { new: true }
        ).then(user => res.json(user))
      } else {
        User.findOne({ handle: newSettings.handle })
          .then(user => {
            if (user) {
              errors.handle = 'that handle already exists'
              res.status(400).json(errors)
            }
          })
      }
    })
})

// delete current user  ----------------------------------------------------

router.delete('/current', auth, (req, res, next) => {
  User.findOneAndRemove({ _id: req.user.id })
    .then(() => res.json({ success: 'user was deleted.' }))
    .catch(err => res.status(400).json({ errors: err }))
})

module.exports = router
