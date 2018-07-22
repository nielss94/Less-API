const express = require('express');
const router = express.Router();
const dbPool = require('../db/dbConnection');

router.get('*', (req, res) => {

    const query = 'SELECT * from test';

    dbPool.getConnection((err, connection) => {
        if(err) {
            res.sendStatus(500);
        }
        connection.query(query, (err, results) => {
            connection.release();
            if(err) {
                res.sendStatus(400);
            }
            res.status(200).json(results);
            
        });
    });
});

router.post('*', (req, res) => {
    const body = req.body;

    res.status(200).json(body);
});

module.exports = router;