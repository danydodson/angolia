const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true }
)

module.exports = Like = mongoose.model('Like', LikeSchema)