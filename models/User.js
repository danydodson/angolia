const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  type: { type: String, default: 'basic' },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  handle: { type: String, required: true },
  email: { type: String, required: true },
  favs: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  follows: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  password: { type: String, required: true }
}, { timestamps: true }
)

module.exports = User = mongoose.model('User', UserSchema)