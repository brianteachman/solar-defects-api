// const fs = require("fs");
const express = require('express');
var router = express.Router();

// fs.createReadStream('data/users.json');
// fs.read();

let testUsers = [{"id": 1,"username": "mrbtx" }];

/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.send('respond with a resource');

    // Return JSON to the client
    res.json(testUsers);
});

module.exports = router;
