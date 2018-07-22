const express = require('express');
const router = express.Router();
const dbPool = require('../db/dbConnection');
const auth = require('../auth/authentication');

router.post('/', auth.authToken, (req, res) => {
    const finishDate = req.body.finishDate;
    const goalValue = req.body.goalValue;
    const streakGoal = req.body.goalValue;
    const isEndGoal = req.body.isEndGoal;
    const addictionId = req.body.addictionId;

    const userId = req.userId;

    const checkQuery = `SELECT * FROM user_addiction 
                        WHERE user_addiction.UserId = ? AND user_addiction.IsOwner = 1 AND user_addiction.AddictionId = ?`;

    const query = `INSERT INTO goal (FinishDate, GoalValue, StreakGoal, IsEndGoal, Addiction) 
    VALUES (?, ?, ?, ?, ?);`;

    dbPool.getConnection((err, connection) => {
        if(err) {
            res.sendStatus(500);
        }

        connection.query(checkQuery, [userId, addictionId], (err, results) => {
            connection.release();
            if(err) {
                console.log(err);
                res.sendStatus(500);
            } else {

                if(results.length > 0) {
                    connection.query(query, [finishDate, goalValue, streakGoal, isEndGoal, addictionId], (err, results) => {
                        connection.release();
            
                        if(err) {
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                } else {
                    res.sendStatus(404);
                }
            }
        });

        
    });

});

router.get('/:addictionId', auth.authToken, (req, res) => {
    const addictionId = req.params.addictionId;

    const userId = req.userId;

    const checkQuery = `SELECT * FROM user_addiction 
                        WHERE user_addiction.UserId = ? AND user_addiction.IsOwner = 1 AND user_addiction.AddictionId = ?`;

    const getQuery = `SELECT * FROM goal
                        WHERE goal.Addiction = ?`;

    dbPool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.sendStatus(500);
        }
        
        connection.query(checkQuery, [userId, addictionId], (err, results) => {
            if(err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                if(results.length > 0) {
                    
                    connection.query(getQuery, [addictionId], (err, results) => {
                        connection.release();
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            res.status(200).json(results);
                        }
                    })

                } else {
                    res.sendStatus(404);
                }
            }
        });
    });
});

module.exports = router;