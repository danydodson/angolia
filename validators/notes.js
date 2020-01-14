const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateNotes(data) {
  let errors = {}

  data.content = !isEmpty(data.content) ? data.content : ''

  if (Validator.isEmpty(data.content)) {
    errors.content = 'Content field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
