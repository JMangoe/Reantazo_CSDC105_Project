require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require ('multer');
const fs = require('fs');
const helmet = require('helmet');
const cloudinary = require('./utils/cloudinary');


const uploadMiddleware = multer({ 
    dest: 'uploads/',
    limits: {
        fieldSize: 10 * 1024 * 1024, //10MB for text fields
    },
});

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const mongoURI = process.env.MONGODB_URI;
const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

app.get('/', (req, res) => {
    res.send('API is running <3');
})

function requireAuth(req, res, next) {
    const { token } = req.cookies;
    if (!token) return res.status(401).json('Not authenticated');

    jwt.verify(token, secret, {}, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json('Invalid token.');
        }
        req.user = user; //attach user info to req object
        next();
    })
}

app.use(cors({
    credentials:true, 
    origin: ['http://localhost:3000', process.env.CLIENT_ORIGIN]
    }));
app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cookieParser());

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: "Password must be 8-20 characters, include at least 1 uppercase letter, 1 number, and 1 special character."
        });
    }

    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        console.log(e)
        res.status(400).json(e);
    }
});

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});

    if(!userDoc) { //user not found
        return res.status(400).json('Invalid username or password');
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (!passOk){
        return res.status(400).json('Invalid username or password');      
    }

    //if password is correct, create JWT token and send it in cookie
    //add expiry to jwt for boost of security
    jwt.sign({username, id:userDoc._id}, secret, {expiresIn: '1d'}, (err,token) => {
        if (err) {
            console.error(err);
            return res.status(500).json('Internal server error');
        }
        res.cookie('token', token, { 
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }).json({
            id:userDoc._id,
            username,
        });
    });

});

app.get('/profile', async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json(null);

    jwt.verify(token, secret, {}, async (err, userData) => {
        if (err) return res.status(403).json(null);

        try {
            const userDoc = await User.findById(userData.id);
            if (!userDoc) {
                // user deleted but token still exists — force logout
                return res.status(401).json(null);
            }

            res.json({
                id: userDoc._id,
                username: userDoc.username,
            });
        } catch (e) {
            console.error('Error verifying profile:', e);
            res.status(500).json(null);
        }
    });
});


app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  }).json({ message: "Logged out" });
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        fs.unlinkSync(path);
        return res.status(400).json({ error: 'File type not allowed' });
    }

    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(path, {
            folder: "broquote_covers", // optional folder
            use_filename: true,
        });

        fs.unlinkSync(path); // delete local file after upload

        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) throw err;
            const { title, summary, content } = req.body;
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: result.secure_url, // use Cloudinary URL
                author: info.id,
            });
            res.json(postDoc);
        });
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        res.status(500).json({ error: "Failed to upload image" });
    }
});

app.put('/post', uploadMiddleware.single('file'), async(req,res) => {
    let newPath = null;
    if (req.file){
        const {originalname, path} = req.file;
        const ext = originalname.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(ext)) {
            fs.unlinkSync(path);  // delete the temp uploaded file
            return res.status(400).json({error: 'File type not allowed'});
        }

        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = postDoc.author.toString() === info.id
        if (!isAuthor) {
            return res.status(400).json('You are not the author.');
        }

        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        if (newPath) {
            try {
                const result = await cloudinary.uploader.upload(newPath, {
                folder: "broquote_covers",
                use_filename: true,
                });
                postDoc.cover = result.secure_url;
                fs.unlinkSync(newPath); // remove the local file after upload
            } catch (err) {
                console.error("Cloudinary upload error (PUT):", err);
                return res.status(500).json({ error: "Failed to upload new image" });
            }
        }

        await postDoc.save();

        res.json(postDoc);
        
    });

});

// display latest and most viewed post as highlight
app.get('/post/highlights', async (req, res) => {
    try {
        const latestPost = await Post.findOne()
        .populate('author', ['username'])
        .sort({ createdAt: -1 });

        let mostViewedPost = await Post.findOne({ _id: { $ne: latestPost?._id } })
        .populate('author', ['username'])
        .sort({ views: -1 });

        // If there’s no other post with different ID (e.g. only 1 post exists), fallback
        if (!mostViewedPost && latestPost) {
        mostViewedPost = latestPost;
        }

        res.json({ latestPost, mostViewedPost });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch post highlights" });
    }
});

app.get('/post', async (req,res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
            .limit(20)
    );
});

app.get('/post/:id', async(req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

//checking views
app.post('/post/:id/view', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.status(200).json({ message: "View counted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to count view" });
    }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Additional Features:

//delete function
app.delete('/post/:id', async(req,res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async(err,info) => {
        if (err) return res.status(401).json({error: 'Unauthorized'});

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({error: 'Post not found'});

        const isAuthor = post.author.toString() === info.id;
        if (!isAuthor) return res.status(403).json({error: 'You are not the author.'});

        await Post.deleteOne({_id: req.params.id});
        res.json({ message: 'Post deleted successfully.'});
    });
})

//like and unlike function
app.post('/post/:id/like', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!post.likes.includes(info.id)) {
      post.likes.push(info.id);
      await post.save();
    }

    res.json({ likes: post.likes.length });
  });
});

app.get('/post/:id/like/check', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ liked: false });

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ liked: false });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ liked: false });

    const liked = post.likes.includes(info.id);
    res.json({ liked });
  });
});


app.post('/post/:id/unlike', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.likes = post.likes.filter(userId => userId.toString() !== info.id);
    await post.save();

    res.json({ likes: post.likes.length });
  });
});

//comment function
app.post('/post/:postId/comments', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    const { postId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = await Comment.create({
      text,
      author: info.id,
      post: postId
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username');

    res.json(populatedComment);
  });
});

app.get('/post/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.delete('/comments/:id', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    const comment = await Comment.findById(req.params.id)
      .populate('author', '_id')
      .populate('post', 'author');

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const isCommentAuthor = comment.author._id.toString() === info.id;
    const isPostAuthor = comment.post.author.toString() === info.id;

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    await Post.findByIdAndUpdate(comment.post._id, {
      $pull: { comments: comment._id }
    });

    await Comment.deleteOne({ _id: req.params.id });

    res.json({ message: 'Comment deleted successfully' });
  });
});
