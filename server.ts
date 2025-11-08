import express, { Request, Response} from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
    indexPage
} from './routes/pages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, './frontend')));

app.use(express.json());

app.get('/', indexPage)

app.listen(port, () => {
    console.log('Server running on port ${port}');
})