const express = require('express');
const router = express.Router();
const dbPool = require('../db/dbConnection');
const auth = require('../auth/authentication');
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

router.get('/:id', auth.authToken, (req, res) => {

    const id = req.params.id;
    const email = req.email;
    const query = `SELECT addiction.* from user_addiction
                    INNER JOIN addiction 
                    ON addiction.Id = user_addiction.AddictionId
                    INNER JOIN user
                    ON user.Id = user_addiction.UserId
                    WHERE addiction.Id = ? AND user.Email = ? AND user_addiction.IsOwner = 1`;
    
    dbPool.getConnection((err, connection) => {
        if(err) {
            res.sendStatus(500);
        }
        connection.query(query, [id,email], (err, results) => {
            connection.release();
            if(err) {
                res.sendStatus(400);
            } else {
                if(results.length == 0) {
                    res.sendStatus(404);
                }else{
                    const foundAddiction = results[0];
                    res.status(200).json(foundAddiction);
                }
            }
        });
    });
});

module.exports = router;
