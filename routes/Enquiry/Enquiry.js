const router = require('express').Router();

router.get('/', (req, res) => res.send({ name: "uday", class: "ab2" }))

module.exports = router; 