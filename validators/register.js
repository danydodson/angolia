const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateRegister(data) {

  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''
  data.handle = !isEmpty(data.handle) ? data.handle : ''
  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  // --------------------------------------------------------------

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'First name must be between 2 and 30 characters'
  }
  if (!Validator.isLength(data.handle, { min: 2, max: 30 })) {
    errors.handle = 'Username must be between 2 and 30 characters'
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters'
  }

  // --------------------------------------------------------------

  if (Validator.isEmpty(data.name)) {
    errors.name = 'First name field is required'
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Username field is required'
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  }

  // --------------------------------------------------------------

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  // --------------------------------------------------------------

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
