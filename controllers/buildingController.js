const { json } = require('express');
const buildingModel = require('../models/buidingModel');

exports.addBuilding = async (req, res) => {
    try {
        const {building_name, total_floor} = req.body;
        const buildId = await buildingModel.insert(building_name, total_floor);

        res.json({
            success: true,
            buildId: buildId
        });
    } catch(err){
        console.log(`[buildingController] ${err}`);
        res.json({
            success: false,
        })
    }
}


exports.getAllBuild = async (req, res) => {
    const row = await buildingModel.selectAll();
    res.json({
        success: true,
        data: row
    });
}