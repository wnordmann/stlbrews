var express = require('express');
var router = express.Router();

/* GET users listing. */
//INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)
//VALUES ('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway');

router.post('/', function (req, res, next) {
  const insertString = `INSERT INTO feesandbeersbrought \
    ( MemberId, MonthNum, YearNum, AttendedMeeting, BroughtBeer, FeePaid) \
    VALUES ( ${req.body.MemberId}, ${req.body.MonthNum}, \
    ${req.body.YearNum}, ${req.body.AttendedMeeting}, \
    ${req.body.BroughtBeer}, ${req.body.FeePaid});`

    res.locals.mysql.query(insertString, req.body,
        function (err, result) {
            if (err) throw err;
            res.send('User added to database with ID: ' + result.insertId);
        }
    );
});


module.exports = router;
