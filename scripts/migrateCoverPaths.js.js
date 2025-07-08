require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Post = require('./models/Post'); 

const mongoURI = process.env.MONGODB_URI;
const BASE_URL = 'https://broquote-backend.onrender.com/';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log("🔧 Connected to MongoDB");

    const posts = await Post.find({});
    let updatedCount = 0;

    for (const post of posts) {
      if (post.cover && !post.cover.startsWith('http')) {
        const filename = path.basename(post.cover);
        const newCover = `${BASE_URL}uploads/${filename}`;

        post.cover = newCover;
        await post.save();
        console.log(`✅ Updated post ${post._id} with new cover: ${newCover}`);
        updatedCount++;
      }
    }

    console.log(`🎉 Finished! ${updatedCount} posts updated.`);
    process.exit();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
