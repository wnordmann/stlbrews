var express = require('express');
var router = express.Router();

// UPDATE membershiplist
// SET 2018_Dues_Paid = 1
// WHERE MemberId = 268;

router.post('/', function (req, res, next) {
  const insertString = `UPDATE membershiplist \
                    SET 2018_Dues_Paid = 1 \
                    WHERE MemberId = ${req.body.MemberId};`
    res.locals.mysql.query(insertString, req.body,
        function (err, result) {
            if (err) throw err;
            res.send('User added to database with ID: ' + result.insertId);
        }
    );
});


module.exports = router;
