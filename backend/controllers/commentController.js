const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

exports.createComment = asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const { text } = req.body;
        const authorId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const comment = await Comment.create({ text, author: authorId, post: postId });

        post.comments.push(comment._id);
        await post.save();

        const populatedComment = await Comment.findById(comment._id).populate('author', 'username');
        res.status(201).json(populatedComment);
});

exports.getComments = asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate('author', 'username').sort({ createdAt: 1 });
        res.json(comments);
});

exports.deleteComment = asyncHandler(async (req, res) => {
        const { id: commentId } = req.params;
        const { id: userId } = req.user;

        const comment = await Comment.findById(commentId).populate('post', 'author');
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const isCommentAuthor = comment.author.toString() === userId;
        const isPostAuthor = comment.post.author.toString() === userId;

        if (!isCommentAuthor && !isPostAuthor) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
        }

        await Post.findByIdAndUpdate(comment.post._id, {
            $pull: { comments: comment._id }
        });

        await Comment.deleteOne({ _id: commentId });

        res.json({ message: 'Comment deleted successfully.' });
});
