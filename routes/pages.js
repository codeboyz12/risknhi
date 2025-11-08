const path = require('path');
const frontendPath = path.resolve(__dirname, '../frontend');

exports.index = (req, res) => {
    console.log('Hi')
    res.sendFile(path.join(frontendPath, 'index.html'));
}

exports.second = (req, res) => {
    res.sendFile(path.join(frontendPath, 'second.html'));
}