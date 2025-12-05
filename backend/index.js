require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', process.env.CLIENT_ORIGIN]
}));
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running <3');
})

// Define Routes
// It's good practice to prefix API routes with /api/v1 or similar
app.use('/api', authRoutes);
app.use('/api/posts', postRoutes); // Handles /api/posts and /api/posts/:id/comments
app.use('/api/comments', commentRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
