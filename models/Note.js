const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoteSchema = new Schema({
  content: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true }
)

module.exports = Note = mongoose.model('Note', NoteSchema)