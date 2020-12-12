const express = require('express');
const Category = require('../models/categories.js');

const router = express.Router();

router.get('/categories', (req, res) => {
    Category.find()
        .then(result => {
            res.send(result);
        }).catch(err => console.log(err))
});

module.exports = router;