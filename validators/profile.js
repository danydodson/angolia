const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateProfile(data) {
  let errors = {}

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
