const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const passport = require('passport');

const app = express();
const PORT = 3000;

// Import routers
const notesRoutes = require('./routers/notes');
const authRoutes = require('./routers/auth');
const session = require('express-session');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const loggedInMiddleware = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        // res.status(401).json({ message: 'Unauthorized access. Please login to continue.' });
        res.redirect('/auth/login');
    }
};

// Session Middleware Setup
app.use(session({
  secret: '([M@jQaFokwJ?Xz8',
  resave: false,
  saveUninitialized: false,
  cookie: {
     secure: false,  // Set to true if using HTTPS
     maxAge: 1000 * 60 * 60 * 24 // 1 hour
    }
}));

app.use(passport.session());

// Connect to DB
mongoose.connect('mongodb://localhost:27017/notesApp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Redirect root to /notes
app.get('/', (req, res) => res.redirect('/notes'));

// Route requests to the auth router for handling authentication endpoints (register, login, logout)
app.use('/auth', authRoutes);         // Auth routes (login/register)
// Route requests to the notes router for handling note-related endpoints
app.use('/notes', loggedInMiddleware, notesRoutes);   // Notes routes

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    res.status(status).send({ message: err.message || 'Internal Server Error' });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
