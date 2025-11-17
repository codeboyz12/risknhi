const express = require('express');
const path = require('path');
const pages = require('./routes/pages');
const apiRoutes = require('./routes/api');
const db = require('./config/db');
const {requireLogin} = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);

app.get('/', requireLogin, pages.index);
app.get('/second', pages.second);
app.get('/register', pages.register);
app.get('/login', pages.login);

app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});