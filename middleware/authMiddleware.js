const {sessions} = require('../variable/variable');

exports.requireLogin = (req, res, next) => {
    const sessionId = req.cookies?.sessionId;
    console.log(`[middleware] sessionId = ${sessionId}`);

    if (!sessionId || !sessions[sessionId]) {
        return res.redirect('/login');
    }

    req.user = sessions[sessionId];
    next();
};
