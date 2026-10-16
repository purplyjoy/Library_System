const express = require('express');
const router = express.Router();
const pool = require('../db');

//ARCHIVED BOOKS
router.get('/archived', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT books.*, categories.category 
      FROM books 
      LEFT JOIN categories ON books.category_id = categories.category_id
      WHERE books.archived = 1 
      ORDER BY books.title ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch archived books' });
  }
});

//UNARCHIVE BOOK
router.put('/unarchive/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE books SET archived = 0 WHERE book_id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book unarchived successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ARCHIVE BOOK
router.put('/archive/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(
      `UPDATE books SET archived = 1 WHERE book_id = ?`,
      [id]
    );
    
    res.json({ message: 'Book archived successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET ALL BOOKS
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT books.*, categories.category 
      FROM books 
      LEFT JOIN categories ON books.category_id = categories.category_id
      WHERE books.archived = 0 
      ORDER BY books.title ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET SINGLE BOOK
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT books.*, categories.category 
      FROM books 
      LEFT JOIN categories ON books.category_id = categories.category_id
      WHERE books.book_id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ADD BOOK
router.post('/', async (req, res) => {

  const {
    title,
    author,
    isbn,
    publisher,
    publication_year,
    total_copies,
    available_copies,
    category_id
  } = req.body;

  try {

    await pool.query(
      `INSERT INTO books
      (
        title,
        author,
        isbn,
        publisher,
        publication_year,
        total_copies,
        available_copies,
        category_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        author,
        isbn,
        publisher,
        publication_year,
        total_copies,
        available_copies,
        category_id
      ]
    );

    res.json({
      message: 'Book added successfully'
    });
  } catch (err) {
    console.error('ADD BOOK ERROR:', err);
    res.status(500).json({
      error: err.message
    });
  }
});

//UPDATE BOOK
router.put('/:id', async (req, res) => {
  const {
    title, author, isbn, publisher,
    publication_year, total_copies, available_copies, category_id
  } = req.body;
 
  try {
    const [result] = await pool.query(
      `UPDATE books
       SET title = ?, author = ?, isbn = ?, publisher = ?,
           publication_year = ?, total_copies = ?, available_copies = ?, category_id = ?
       WHERE book_id = ?`,
      [title, author, isbn, publisher, publication_year, total_copies, available_copies, category_id, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
//DELETE BOOK
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE book_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;