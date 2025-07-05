const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new Schema ({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: {type:Schema.Types.ObjectId, ref:'User'},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], //for likes
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], //for comments
    views: { type: Number, default: 0 }, //for views
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;