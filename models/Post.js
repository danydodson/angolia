const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  //objectID: { type: String },
  stream_id: { type: String, },
  url: { type: String },
  title: { type: String },
  content: { type: String },
  image: { type: String },
  category: { type: String, },
  mediums: [{ type: String, }],
  tags: [{ type: String }],
  featured: { type: Boolean },
  shareable: { type: Boolean },
  allow_notes: { type: Boolean },
  mature: { type: Boolean },
  purchasable: { type: Boolean },
  price: { type: String, default: null },
  slug: { type: String, lowercase: true, createIndexes: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  likes: [{ user: { type: Schema.Types.ObjectId, ref: 'User' } }],
}, { timestamps: true }
)

module.exports = Post = mongoose.model('Post', PostSchema)