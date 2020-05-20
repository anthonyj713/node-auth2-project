const express = require('express');

const Users = require('./users-model.js');

const router = express.Router();

const restricted = require('../auth/middleware.js');

router.use(restricted);

router.get('/', (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json({
            users, jwt: req.jwt
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message:'There was an error retrieving the users list'
        });
    });
});

// function checkDepartment(department) {
//     return function (req, res, next) {
//         if (req.jwt && req.jwt.department === department){
//             next();
//         } else {
//             res.status(403).json({
//                 message: 'You do not have access to this department'
//             });
//         };
//     };
// };

module.exports = router;