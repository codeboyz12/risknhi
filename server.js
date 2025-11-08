const express = require('express');
const path = require('path');
const pages = require('./routes/pages');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', pages.index);
app.get('/second', pages.second);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});