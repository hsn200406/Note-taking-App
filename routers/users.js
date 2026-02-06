const express = require('express');
const router = express.Router();
const { User, Note } = require('../models/models');
const crypto = require('crypto');

// Display settings page
router.get('/settings', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const notesCount = await Note.countDocuments({ user: req.user.id });
        
        res.render('settings', {
            user: req.user,
            userDetails: user,
            notesCount: notesCount,
            page: 'settings'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error loading settings page' });
    }
});

// Get user profile information
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const notesCount = await Note.countDocuments({ user: req.user.id });
        
        res.json({
            username: user.username,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            notesCount: notesCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving profile' });
    }
});

// Verify password
router.post('/verify-password', async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password using crypto
        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) {
                return res.status(500).json({ message: 'Error verifying password' });
            }

            if (!crypto.timingSafeEqual(Buffer.from(user.hashedPassword, 'base64'), hashedPassword)) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            res.json({ message: 'Password verified' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error verifying password' });
    }
});

// Delete user account and all associated notes
router.delete('/account', async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password before deletion
        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', async function(err, hashedPassword) {
            if (err) {
                return res.status(500).json({ message: 'Error verifying password' });
            }

            if (!crypto.timingSafeEqual(Buffer.from(user.hashedPassword, 'base64'), hashedPassword)) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            try {
                // Delete all notes associated with this user
                await Note.deleteMany({ user: userId });

                // Delete the user account
                await User.findByIdAndDelete(userId);

                // Logout user
                req.logout((err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error during logout' });
                    }
                    res.json({ message: 'Account deleted successfully. Redirecting to home...' });
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting account' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting account' });
    }
});

// Get account statistics
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user.id;
        const notesCount = await Note.countDocuments({ user: userId });
        const user = await User.findById(userId);

        const accountAgeMs = Date.now() - user.createdAt.getTime();
        const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));

        res.json({
            notesCount: notesCount,
            accountAgeDays: accountAgeDays,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving statistics' });
    }
});

module.exports = router;
