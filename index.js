const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;

const Note = require('./models/Note');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());


app.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort({ date: -1 });
        res.render('index', {
            title: 'Note Taking App',
            notes: notes
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error retrieving notes' });
    }
});

app.post('/notes', async (req, res) => {
    const { title, content } = req.body;

    //Server side validation
    if (!title || !content || !title.trim() || !content.trim()) {
        return res.status(400).send({ message: 'Title and content are required to add a note' });
    }

    try {
        await Note.create({ title: title.trim(), content: content.trim() });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error adding note' });
    }

});

app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    // Server side validation
    if (!title || !content || !title.trim() || !content.trim()) {
        return res.status(400).send({ message: 'Title and content are required to update a note' });
    }

    try {
        const note = await Note.findByIdAndUpdate(
            id,
            { title: title.trim(), content: content.trim() },
            { new: true }
        )

        if (!note) return res.status(404).send({ message: 'Note not found' });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error updating note' });
    }

});

app.delete('/notes/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).send({ message: 'Note not found' });
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error deleting note' });
    }
});

// Add DB connection here
mongoose.connect('mongodb://localhost:27017/notesApp')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});