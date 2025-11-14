const express = require('express');
const path = require('path');
const pages = require('./routes/pages');
const apiRoutes = require('./routes/api');

const app = express();
const db = require('./config/db');
const port = 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/api', apiRoutes);

app.get('/', pages.index);
app.get('/second', pages.second);
app.get('/register', pages.register);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});