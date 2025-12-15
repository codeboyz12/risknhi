const express = require('express');
const path = require('path');
const pages = require('./routes/pages');
const apiRoutes = require('./routes/api');
const db = require('./config/db');
const {requireLogin} = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const patientModel = require('./models/patientModel');

const app = express();
const port = 8000;

const CRON_INTERVAL = 2 * 60 * 1000;

setInterval(async () => {
    try {
        // เรียกฟังก์ชันเคลียร์คนป่วย
        const affectedRows = await patientModel.autoHealOldPatients();

        // (Optional) แสดง log เพื่อดูว่า cron job ทำงานอยู่
        console.log(`[Cron] Checked for old patients. Healed: ${affectedRows}`);

    } catch (err) {
        console.error(`[Cron] Error running auto-heal: ${err}`);
    }
}, CRON_INTERVAL);

app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);

app.get('/', pages.index); // Version for production
app.get('/register', pages.register);
app.get('/login', pages.login);
app.get('/sickreccord', requireLogin, pages.sickreccord);
app.get('/information', requireLogin, pages.information);

app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});