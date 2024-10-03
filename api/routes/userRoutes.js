const express = require("express");
const router = express.Router();

router.get('/test', (req, res) => {
    res.status(200).send("<h1>OLHA A MENSAGEEEEM</h1>");
});

module.exports = router;