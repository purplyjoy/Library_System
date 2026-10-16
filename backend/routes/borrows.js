  const express = require('express');
  const router = express.Router();

  const pool = require('../db');

  //GET BORROW RECORD
  router.get('/', async (req, res) => {

    try {
      await pool.query(`
        UPDATE borrow_records
        SET status = 'overdue'
        WHERE status = 'borrowed' AND due_date < CURDATE()
      `);

      const [rows] = await pool.query(`
        SELECT
          borrow_records.borrow_id,
          borrow_records.name,
          borrow_records.email,
          borrow_records.address,
          borrow_records.book_id,
          borrow_records.status,
          DATE_FORMAT(CONVERT_TZ(borrow_records.borrow_date, @@session.time_zone, '+08:00'), '%Y-%m-%d') AS borrow_date,
          DATE_FORMAT(borrow_records.due_date,    '%Y-%m-%d') AS due_date,
          DATE_FORMAT(borrow_records.return_date, '%Y-%m-%d') AS return_date,
          books.title
        FROM borrow_records
        JOIN books ON borrow_records.book_id = books.book_id
        ORDER BY borrow_id ASC
      `);

      res.json(rows);
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  });


  //ADD BORROW RECORD
  router.post('/', async (req, res) => {

    const {
      name,
      email,
      address,
      book_id,
      due_date
    } = req.body;

    try {

      const [[book]] = await pool.query(
        'SELECT available_copies FROM books WHERE book_id = ?',
        [book_id]
      );

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      if (book.available_copies <= 0) {
        return res.status(400).json({ error: 'No available copies for this book' });
      }

      await pool.query(
        `INSERT INTO borrow_records
        (
          name,
          email,
          address,
          book_id,
          due_date,
          status
        )
        VALUES (?, ?, ?, ?, ?, 'borrowed')`,
        [
          name,
          email,
          address,
          book_id,
          due_date || null
        ]
      );

      //decrease available copies
      await pool.query(
        `UPDATE books
        SET available_copies =
        available_copies - 1
        WHERE book_id = ?`,
        [book_id]
      );

      res.json({
        message: 'Borrow record added'
      });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  });

  //RETURN 
  router.put('/return/:id', async (req, res) => {
    try {
      const [[record]] = await pool.query(
        'SELECT * FROM borrow_records WHERE borrow_id = ?',
        [req.params.id]
      );
  
      if (!record) {
        return res.status(404).json({ error: 'Borrow record not found' });
      }
      if (record.status === 'returned') {
        return res.status(400).json({ error: 'Book already returned' });
      }
  
      await pool.query(
        `UPDATE borrow_records
        SET status = 'returned', return_date = CURDATE()
        WHERE borrow_id = ?`,
        [req.params.id]
      );
  
      await pool.query(
        'UPDATE books SET available_copies = available_copies + 1 WHERE book_id = ?',
        [record.book_id]
      );
  
      res.json({ message: 'Book returned successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //EDIT BORROW RECORD 
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM borrow_records WHERE borrow_id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Borrow record not found' });
      res.json(rows[0]);
    } catch (err) {
      console.log(err.message); 
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    
    const {
      name, email, address, book_id, due_date
    } = req.body;
  
    try {
      const [result] = await pool.query(
        `UPDATE borrow_records
        SET name = ?, email = ?, address = ?, book_id = ?,
            due_date = ?
        WHERE borrow_id = ?`,
        [name, email, address, book_id, due_date, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Borrow record not found' });
      res.json({ message: 'Borrow record updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  module.exports = router;