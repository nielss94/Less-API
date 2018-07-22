const express = require('express');
const router = express.Router();
const dbPool = require('../db/dbConnection');
const auth = require('../auth/authentication');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

router.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let query = 'SELECT * FROM user WHERE email = ?;'

    dbPool.getConnection((err, connection) => {
        if(err) {
            res.sendStatus(500);
        }
        connection.query(query, [email], (err, results) => {
            connection.release();
            if(err) {
                res.sendStatus(400);
            }else{
                const foundUser = results[0];

                if(foundUser.length == 0) {
                    res.sendStatus(404);
                } else {
                    bcrypt.compare(password, foundUser.Password, (err,success) => {
                        if(err) {
                            res.sendStatus(401);
                        } 
                        
                        if(success){
                            const token = auth.createToken(email, foundUser.Id);
                            res.status(200).json({
                                "AuthorizationToken" : token
                            });
                        }else {
                            res.sendStatus(401);
                        }
                    })
                }
            }
        });
    });
});

module.exports = router;
