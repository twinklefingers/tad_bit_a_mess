var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';


//AJAX requests:
router.delete('/:id', function(req, res) {
    console.log("reached delete request");
    var id = req.params.id;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!ERROR!!!\n error in DELETE, pg.connect\n", err, "\n \n \n \n");
        }

        //To manage strings and refrences cleaner
        var refrenceValues = [id];
        var queryString = 'DELETE FROM todolist WHERE id = $1';

        client.query(queryString, refrenceValues),
            function(err, result) {
                done();
                if (err) {
                    console.log("\n \n \n \n!!!ERROR!!!\n error in DELETE, client.query: ", err, "\n \n \n \n");
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
            }
    });
});

router.get('/', function(req, res) {
    console.log("reached get request");
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!ERROR!!!\n error in GET, pg.connect", err, "\n \n \n \n");
        }

        //To manage strings and refrences cleaner
        var queryStringGET = 'SELECT * FROM todolist';

        client.query(queryStringGET),
            function(err, result) {
                console.log(result);
                done(); //closes connection, I only can have ten :(
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!ERROR!!!\n error in GET, client.query: ", err, "\n \n \n \n");
                    return;
                }
                res.send(result.rows);
            }
    });
});

router.post('/', function(req, res) {
    var item = req.body;
    console.log('var item: ', item);
    console.log("reached post request");
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!ERROR!!!\n error in POST, pg.connect ", err, "\n \n \n \n");
        }
        client.query('INSERT INTO todolist (newitem) ' + // case sensitive?
            'VALUES ($1)', [item.newitem],
            function(err, result) {
                done();

                if (err) {
                    console.log("\n \n \n \n!!!ERROR!!!\n error in POST, client.query: ", err, "\n \n \n \n");
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                    res.send(result.rows);
                }
            });

    });
});


router.put('/:id', function(req, res) {
    var id = req.params.id;
    var rowValue = req.body;
    console.log('reached post request');

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log("\n \n \n \n!!!ERROR!!!\n error in PUT, pg.connect", err, "\n \n \n \n");
            res.sendStatus(500);
        }

        //To manage strings and refrences cleaner
        var queryString = 'UPDATE todolist SET newItem = $1, completedItem = $2 WHERE id = $3';
        var refrenceValues = [rowValue.newitem, rowValue.completeditem, id];

        client.query(queryString, refrenceValues,

            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!ERROR!!!\n error in PUT, client.query: ", err, "\n \n \n \n");
                    return;
                } else {
                    res.sendStatus(200);
                }
            });

    });

});



module.exports = router;
