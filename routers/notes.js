const express = require('express');
const router = express.Router();
const { Note } = require('../models/models');

// Display all notes (main page)
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
            .sort({ 
                updatedAt: -1,  // first sort by updatedAt descending
                createdAt: -1   // then sort by createdAt descending if no updatedAt
            });

        res.render('index', { title: 'Note Taking App', notes, user: req.user, page: 'notes' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error retrieving notes' });
    }
});


// Show create form
router.get('/new', (req, res) => {
    res.render('add', { user: req.user, page: 'notes'});
});

// Show edit form
router.get('/:id/edit', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send('Note not found');
        res.render('edit', { note, user: req.user, page: 'notes' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading edit page');
    }
});

// Add new note
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content || !title.trim() || !content.trim()) {
        return res.status(400).send({ message: 'Title and content are required' });
    }
    try {
        const newNote = new Note({ title: title.trim(), content: content.trim(), user: req.user.id });
        const result = await newNote.save();
        // res.status(201).json({ message: 'Note added successfully', note: result });
        res.redirect('/notes');
    } catch (err) {
        res.status(500).json({ message: 'Error adding note', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) return res.redirect('/notes');

    res.render('view', {
    note,
    user: req.user,
    page: 'notes'
    });

  } catch (err) {
    console.error(err);
    res.redirect('/notes');
  }
});

// Update note
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content || !title.trim() || !content.trim()) {
        return res.status(400).send({ message: 'Title and content are required' });
    }
    try {
        const note = await Note.findByIdAndUpdate(
            {_id: id, user: req.user.id},
            { 
                title: title.trim(),
                content: content.trim(),
                updatedAt: new Date()
             },
            { new: true },
        );
        if (!note) return res.status(404).send({ message: 'Note not found' });
        // res.json({ message: 'Note updated successfully', note });
        res.redirect('/notes');
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error updating note' });
    }
});

// Delete note
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user.id });
        if (!deletedNote) return res.status(404).send({ message: 'Note not found' });
        res.redirect('/notes');
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error deleting note' });
    }
});

module.exports = router;
