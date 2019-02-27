var express = require('express');
var router = express.Router();


/**
 * /u
 * 
 */
router.get('/', function(req, res, next) {
   res.send("/u")
});


module.exports = router;
