const mongoose = require('mongoose')
const Schema = mongoose.Schema

var FileSchema = new Schema({
  height: { type: String },
  width: { type: String },
  src: { type: String },
  type: { type: String },
  size: { type: String },
})

module.exports = File = mongoose.model('File', FileSchema)