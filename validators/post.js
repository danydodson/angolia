const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validatePost(data) {
  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.category = !isEmpty(data.category) ? data.category : ''
  data.content = !isEmpty(data.content) ? data.content : ''

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Title field is required'
  }
  
  if (Validator.isEmpty(data.category)) {
    errors.category = 'Category field is required'
  }

  if (Validator.isEmpty(data.content)) {
    errors.content = 'Description field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
