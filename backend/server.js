const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const bookRoutes = require('./routes/books');
const borrowRoutes = require('./routes/borrows');
const categoryRoutes = require('./routes/categories');

app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(5000, () => {

  console.log('Server running on port 5000');

});