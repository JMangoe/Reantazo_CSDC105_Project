require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require ('multer');
const fs = require('fs');

const uploadsDir = __dirname + '/uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

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

app.use(cors({credentials:true, 
    origin: [
        'http://localhost:3000', 
        'https://broquote-essays.vercel.app']
    }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(mongoURI);

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

app.get('/profile', requireAuth, (req, res) => {
    res.json(req.user);
});

app.post('/logout', (req,res) => {
    res.cookie('token', '', { maxAge: 0 }).json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname, path} = req.file;
    const ext = originalname.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) { //only accepts png, jpg, jpeg, gif
        fs.unlinkSync(path);  // delete the temp uploaded file
        return res.status(400).json({error: 'File type not allowed'});
    }

    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        });
        res.json(postDoc);  
    });

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
            postDoc.cover = newPath;
        }

        await postDoc.save();

        res.json(postDoc);
        
    });

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

        if (post.cover && fs.existsSync(post.cover)) {
            fs.unlinkSync(post.cover);
        }

        await Post.deleteOne({_id: req.params.id});
        res.json({ message: 'Post deleted successfully.'});
    });
})