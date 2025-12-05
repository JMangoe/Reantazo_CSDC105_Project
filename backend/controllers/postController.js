const Post = require('../models/Post');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../utils/cloudinary');

const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

// Helper to handle file cleanup
const cleanupFile = (path) => {
    if (!path) return;
    fs.unlink(path, (err) => {
        if (err) console.error("Error deleting temp file:", path, err);
    });
};

exports.createPost = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Cover image is required.' });
    }
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        cleanupFile(path);
        return res.status(400).json({ error: 'File type not allowed' });
    }

        const result = await cloudinary.uploader.upload(path, {
            folder: "broquote_covers",
            use_filename: true,
        });
        cleanupFile(path);

        const { title, summary, content } = req.body;
        const { id: authorId } = req.user; // From requireAuth middleware

        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: result.secure_url,
            author: authorId,
        });

        res.status(201).json(postDoc);
});

exports.updatePost = asyncHandler(async (req, res) => {
    const { id, title, summary, content } = req.body;
    const { id: authorId } = req.user;

        const postDoc = await Post.findById(id);
        if (!postDoc) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        if (postDoc.author.toString() !== authorId) {
            return res.status(403).json({ error: 'You are not the author.' });
        }

        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;

        if (req.file) {
            const { originalname, path } = req.file;
            const ext = originalname.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes(ext)) {
                cleanupFile(path);
                return res.status(400).json({ error: 'File type not allowed' });
            }

            const result = await cloudinary.uploader.upload(path, {
                folder: "broquote_covers",
                use_filename: true,
            });
            postDoc.cover = result.secure_url;
            cleanupFile(path);
        }

        await postDoc.save();
        res.json(postDoc);
});

exports.getPostHighlights = asyncHandler(async (req, res) => {
        const latestPost = await Post.findOne().populate('author', ['username']).sort({ createdAt: -1 });
        let mostViewedPost = await Post.findOne({ _id: { $ne: latestPost?._id } }).populate('author', ['username']).sort({ views: -1 });

        if (!mostViewedPost && latestPost) {
            mostViewedPost = latestPost;
        }

        res.json({ latestPost, mostViewedPost });
});

exports.getAllPosts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);
        const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.json({ posts, totalPages });
});

exports.getPostById = asyncHandler(async (req, res) => {
        const postDoc = await Post.findById(req.params.id).populate('author', ['username']);
        if (!postDoc) return res.status(404).json({ error: 'Post not found' });
        res.json(postDoc);
});

exports.incrementPostView = asyncHandler(async (req, res) => {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.status(200).json({ message: "View counted" });
});

exports.deletePost = asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'You are not the author.' });
        await Post.deleteOne({ _id: req.params.id });
        res.json({ message: 'Post deleted successfully.' });
});

exports.likePost = asyncHandler(async (req, res) => {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            // Use $addToSet to prevent adding the same user ID multiple times
            { $addToSet: { likes: req.user.id } },
            { new: true } // Return the updated document
        );
        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.json({ likes: post.likes.length });
});

exports.unlikePost = asyncHandler(async (req, res) => {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            // Use $pull to remove the user ID from the likes array
            { $pull: { likes: req.user.id } },
            { new: true }
        );
        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.json({ likes: post.likes.length });
});

exports.checkLikeStatus = asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id);
        if (!post) {
            // If post doesn't exist, it can't be liked.
            return res.status(404).json({ liked: false, error: 'Post not found' });
        }

        const liked = post.likes.includes(req.user.id);
        res.json({ liked });
});
