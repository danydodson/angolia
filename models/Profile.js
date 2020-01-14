const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  bio: { type: String },
  image: { type: String },
  website: { type: String },
  location: { type: String },
  status: { type: String, },
  handle: { type: String, },
  mediums: { type: [String], },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }
)

module.exports = Profile = mongoose.model('Profile', ProfileSchema)
