const { json } = require('express');
const userModel = require('../models/userModel');

exports.isUserSick = async (req, res) => {
    try{
        const {userID} = req.body;
        const data = await userModel.checkRecentSick(userID);
        if( data == null ){
            res.json({
                "success": true,
                "stillsick": false,
            })
        } else {
            res.json({
                "success": true,
                "stillsick": true,
                "data": data
            })
        }

    } catch (err) {
        console.log(`[userController] ${err}`)
        res.json({
            "success": false
        });
    }
}