const express = require('express');
const router = express.Router();
const dbPool = require('../db/dbConnection');

router.get('/:linkcode', (req, res) => {

    const linkcode = req.params.linkcode;

    const query = `SELECT user.FirstName, user.LastName, user.DateOfBirth, user.Gender, user.Avatar, addictiontype.Type, addiction.Title, 
                    addiction.Description, addiction.Medium, addiction.Streak
                    FROM user_addiction
                    INNER JOIN user 
                    ON user.Id = user_addiction.UserId
                    INNER JOIN addiction
                    ON addiction.Id = user_addiction.AddictionId
                    INNER JOIN addictiontype
                    ON addiction.AddictionType = addictionType.Id
                    WHERE user_addiction.IsOwner = 1 AND addiction.LinkCode = ?`;
    
    dbPool.getConnection((err, connection) => {
        if(err) {
            res.sendStatus(500);
        }
        connection.query(query, [linkcode], (err, results) => {
            connection.release();
            if(err) {
                res.sendStatus(400);
            } else {
                if(results.length == 0) {
                    res.sendStatus(404);
                }else{
                    const pageFound = results[0];
                    res.status(200).json(pageFound);
                }
            }
        });
    });
});

module.exports = router;
