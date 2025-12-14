const path = require('path');
const frontendPath = path.resolve(__dirname, '../frontend');

exports.index = (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
}

exports.register = (req, res) => {
    res.sendFile(path.join(frontendPath, 'register.html'));
}

exports.login = (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
}

exports.sickreccord = (req, res) => {
    res.sendFile(path.join(frontendPath, 'sick_reccord.html'));
}

exports.information = (req, res) => {
    res.sendFile(path.join(frontendPath, 'information.html'));
}