const express = require('express');
const router = express.Router();
const dbPool = require('../db/dbConnection');
const auth = require('../auth/authentication');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

router.get('/:id', auth.authToken, (req, res) => {

    const id = req.params.id;
    const email = req.email;
    const query = 'SELECT * from user WHERE Id = ? AND Email = ?';
    
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
                    const foundUser = results[0];
                    res.status(200).json(foundUser);
                }
            }
        });
    });
});

router.post('/', (req, res) => {
    const email = req.body.email.toString().toLowerCase().replace(' ','');
    const password = req.body.password.toString().replace(' ','');

    const hash = bcrypt.hashSync(password, salt);

    let query = 'INSERT INTO user (Email, Password) VALUES (?, ?);'

    dbPool.getConnection((err, connection) => {
        connection.release();
        if(err) {
            res.sendStatus(500);
        }
        connection.query(query, [email,hash], (err) => {
            if(err) {
                if(err.errno == 1062){
                    res.sendStatus(412);
                }
                else{
                    res.sendStatus(400);
                }
            }else{
                res.sendStatus(200);
            }
        });
    });
});

module.exports = router;
