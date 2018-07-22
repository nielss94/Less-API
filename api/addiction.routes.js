const express = require('express');
const router = express.Router();
const dbPool = require('../db/dbConnection');
const auth = require('../auth/authentication');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const uuid = require('uuid');

router.post('/', auth.authToken, (req, res) => {
    const email = req.email;
    const addictionType = req.body.addictionType;
    const title = req.body.title;
    const description = req.body.description || '';
    const checkTime = req.body.checkTime;
    const streakStart = req.body.streakStart;
    const medium = req.body.medium;
    const linkCode = uuid();

    let query = `INSERT INTO addiction (AddictionType, Title, Description, CheckTime, StreakStart, Medium, LinkCode) 
                VALUES (?, ?, ?, ?, ?, ?, ?);`

    dbPool.getConnection((err, connection) => {
        if(err) {
            res.sendStatus(500);
        }
        connection.query(query, [addictionType,title, description,checkTime,streakStart,medium,linkCode], (err,results) => {
            if(err) {
                res.sendStatus(400);
            }else{
                const insertedId = results.insertId;
                connection.query('SELECT Id FROM user WHERE Email = ?;', [email], (err,results) => {
                    if(err) {
                        res.sendStatus(400);
                    }else{
                        const userId = results[0].Id;
                        let insertQuery = `INSERT INTO user_addiction (UserId, AddictionId, IsOwner) VALUES 
                                            (?, ?, 1);`
                        connection.query(insertQuery, [userId,insertedId], (err) => {
                            connection.release();
                            if(err) {
                                res.sendStatus(400);
                            }else{
                                res.sendStatus(200);
                            }
                        });
                    }
                });
            }
        });
    });
});

module.exports = router;
