const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user; // attach user info to req object
        next();
    });
}

module.exports = { requireAuth };
