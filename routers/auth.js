// routers/auth.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/models');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const crypto = require('crypto');

passport.use(new LocalStrategy(async function verify(username, password, callback) {
    try {

        const usernameNormalized = username.trim().toLowerCase();

        const user = await User.findOne({ username: usernameNormalized });
        if (!user) { return callback(null, false, { message: 'This user does not exist' }); }

        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return callback(err); }
            if (!crypto.timingSafeEqual(Buffer.from(user.hashedPassword, 'base64'), hashedPassword)) {
                return callback(null, false, { message: 'Incorrect password, try again' });
            }
            return callback(null, user);
        });
    } catch (err) {
        return callback(err);
    }
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user._id,
      username: user.username,
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

// Register a New User
router.post('/register', async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return next({ message: 'Username and password are required' });
    }

    const usernameNormalized = req.body.username.trim().toLowerCase();

    const user = await User.findOne({ username: usernameNormalized });
    if (user) {
        // return next({ message: 'User already exists. Please choose another name' });
        return res.render('register', { error: 'User already exists. Please choose another name', page: 'register', user: null });
    }
    
    if (usernameNormalized.length < 6) {
        return res.render('register', { error: 'Username must be at least 6 characters long', page: 'register', user: null });
    }
    if (req.body.password.length < 12) {
        return res.render('register', { error: 'Password must be at least 12 characters long', page: 'register', user: null });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(req.body.password)) {
        return res.render('register', { error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character', page: 'register', user: null });
    }

    const salt = crypto.randomBytes(12);

    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
        if (err) { return next('Error while encrypting password'); }

        try{
            const newUser = await User.create({
                username: usernameNormalized,
                hashedPassword: hashedPassword.toString('base64'),
                passwordSalt: salt.toString('base64')
        });

        if (!newUser) {
            return next({ message: "Error creating user. Please try again later." });
        }

        // This is until the session is implemented
        // res.status(201).json({ message: 'User registered successfully. Please log in to continue.' });
        res.redirect('/auth/login');

        } catch (error) {
            return next(error);
        }
    });
});

// Login Existing User
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    
    if (!user) {
      return res.render('login', { error: info.message, page: 'login', user: null });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/notes');
    });

    }) (req, res, next);
});

// Logout User
router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/auth/login');
  });
});

// Show register page
router.get('/register', (req, res) => {
  const error = req.query.error || null;  // optional error from query string
  res.render('register', { error, user: req.user, page: 'register' }); // renders register.ejs
});

// Show login page
router.get('/login', (req, res) => {
  const error = req.query.error || null;  // optional error from query string
  res.render('login', { error, user: req.user, page: 'login' }); // renders login.ejs
});

module.exports = router;
