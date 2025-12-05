const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokenAndSetCookie = (res, user) => {
    jwt.sign({ username: user.username, id: user._id }, secret, { expiresIn: '1d' }, (err, token) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        }).json({
            id: user._id,
            username: user.username,
        });
    });
};

exports.registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: "Password must be 8-20 characters, include at least 1 uppercase letter, 1 number, and 1 special character."
        });
    }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists." });
        }

        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.status(201).json({
            id: userDoc._id,
            username: userDoc.username
        });
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
        const userDoc = await User.findOne({ username });

        if (!userDoc || !bcrypt.compareSync(password, userDoc.password)) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        generateTokenAndSetCookie(res, userDoc);
});

exports.googleLogin = asyncHandler(async (req, res) => {
    const { credential } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, sub } = payload;

        let user = await User.findOne({ googleId: sub });
        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = bcrypt.hashSync(randomPassword, 10);

            let proposedUsername = name ? name.trim().replace(/\s+/g, '_') : email.split('@')[0];
            let uniqueUsername = proposedUsername;
            let counter = 1;
            while (await User.findOne({ username: uniqueUsername })) {
                uniqueUsername = `${proposedUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
                if (counter++ > 5) {
                    return res.status(500).json({ error: 'Could not generate a unique username.' });
                }
            }

            user = await User.create({
                username: uniqueUsername,
                googleId: sub,
                email: email,
                password: hashedPassword,
            });
        }

        generateTokenAndSetCookie(res, user);
});

exports.getUserProfile = asyncHandler(async (req, res) => {
    // req.user is attached by the requireAuth middleware
        // Verify user still exists in the database, and don't send the password
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            // This can happen if the user was deleted but the token is still valid
            res.status(404);
            throw new Error('User not found');
        }
        res.json({ id: user._id, username: user.username });
});

exports.logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    }).json({ message: "Logged out" });
};
