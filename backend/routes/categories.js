const express = require('express');
const router = express.Router();
const pool = require('../db'); 

//GET ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY category ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

//GET SINGLE CATEGORY
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE category_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

//UPDATE CATEGORY
router.put('/:id', async (req, res) => {
  const { category } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE categories SET category = ? WHERE category_id = ?',
      [category, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;