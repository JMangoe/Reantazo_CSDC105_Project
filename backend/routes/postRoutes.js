const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { requireAuth } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Post routes
router.post('/', requireAuth, uploadMiddleware.single('file'), postController.createPost);
router.put('/', requireAuth, uploadMiddleware.single('file'), postController.updatePost);
router.get('/highlights', postController.getPostHighlights);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.delete('/:id', requireAuth, postController.deletePost);
router.post('/:id/view', postController.incrementPostView);

// Like/Unlike routes
router.post('/:id/like', requireAuth, postController.likePost);
router.post('/:id/unlike', requireAuth, postController.unlikePost);
router.get('/:id/like/check', requireAuth, postController.checkLikeStatus);

// Nested comment routes
router.post('/:postId/comments', requireAuth, commentController.createComment);
router.get('/:postId/comments', commentController.getComments);

module.exports = router;
