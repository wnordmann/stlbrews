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

// router.get('/', function(req, res, next) {
// 	res.locals.mysql.query('select * from feesandbeersbrought',
//   function (error, results, fields) {
//     if(error){
//       res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
//       //If there is error, we send the error in the error section with 500 status
//       } else {
//         res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//         //If there is no error, all is good and response is 200OK.
//       }
// 	});
// });

module.exports = router;
