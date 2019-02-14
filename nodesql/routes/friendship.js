var express = require('express');
var router = express.Router();

// insert into friendship
// (friendship, memberid, friendshipLead, pulledpork)
// values (1, 504, 1, 0)

router.post('/', function (req, res, next) {
  const insertString = `insert into friendship \
            (friendship, memberid, friendshipLead, pulledpork)
            values (${req.body.friendship}, ${req.body.MemberId}, ${req.body.friendshipLead}, ${req.body.pulledpork} );`
    res.locals.mysql.query(insertString, req.body,
        function (err, result) {
            if (err) throw err;
            res.send('User added to database with ID: ' + result.insertId);
        }
    );
});


module.exports = router;
