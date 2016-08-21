var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';


//AJAX requests:
router.delete('/:id', function(req, res) {
    console.log("reached router.delete request");

    var id = req.params.id;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!ERROR!!!\n error in DELETE, pg.connect\n", err, "\n \n \n \n");
        }
        console.log("Successfully reached router.delete, pg.connect ");

        client.query('DELETE FROM todolist ' +
            'WHERE id = $1', [id],
            function(err, result) {
                done();
                if (err) {
                    console.log("\n \n \n \n!!!ERROR!!!\n error in DELETE, client.query: ", err, "\n \n \n \n");
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
                console.log("Successfully reached router.delete, client.query ");
            });
    });
});

router.get('/', function(req, res) {
    console.log("reached router.get request");

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!ERROR!!!\n error in router.get, pg.connect", err, "\n \n \n \n");
        }

        client.query('SELECT * FROM todolist',
            function(err, result) {
                done(); //closes connection, I only can have ten :(
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!ERROR!!!\n error in router.get, client.query: ", err, "\n \n \n \n");
                    return;
                }
                res.send(result.rows);
            });
    });
});

router.post('/', function(req, res) {
    //updateTask (previously: item) is an object you received from the client
    //Check what you're sending on the client
    var updateTask = req.body;
    console.log("reached router.post request. item: ", updateTask);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!ERROR!!!\n error in router.post, pg.connect ", err, "\n \n \n \n");
        }

        client.query('INSERT INTO todolist (newItem) ' + // case sensitive
            'VALUES ($1)', [updateTask.newItem], //case sensitive
            function(err, result) {
                done();

                if (err) {
                    console.log("\n \n \n \n!!!ERROR!!!\n error in router.post, client.query: ", err, "\n \n \n \n");
                    res.sendStatus(500);
                }
                // res.send(result.rows);
                res.sendStatus(201);
            });
    });
});

// WHY THE HELL DIDN'T THIS CODE WORK?? #hourswasted
// router.put('/:id', function(req, res) {
//     console.log('reached router.put request');
//
//     var id = req.params.id;
//     var rowValue = req.body;
//
//     pg.connect(connectionString, function(err, client, done) {
//         if (err) {
//             console.log("\n \n \n \n!!!ERROR!!!\n error in router.put, pg.connect", err, "\n \n \n \n");
//             res.sendStatus(500);
//         }
//         console.log('successfully reached router.put pg.connect request');
//
//         client.query('UPDATE todolist ' +
//             'SET newItem = $1, ' +
//             'completedItem = $2 ', + //case sensitive
//             ' WHERE id = $3', [rowValue.newItem, rowValue.completedItem, id], //case sensitive
//             function(err, result) {
//                 done();
//                 if (err) {
//                     res.sendStatus(500);
//                     console.log("\n \n \n \n!!!ERROR!!!\n error in router.put, client.query: ", err, "\n \n \n \n");
//                 } else {
//                     res.sendStatus(200);
//                     console.log('successfully completed router.put client.query request');
//                 }
//             });
//     });
//
// });

router.put('/:id', function(req, res) {
    var id = req.params.id;
    var rowValue = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('UPDATE todolist ' +
            'SET newItem = $1 ' +
            // 'completedItem = $2 ' +
            'WHERE id = $2', [rowValue.newItem, id],
            function(err, result) {
                done();

                if (err) {
                    console.log('err', err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
    });
});



module.exports = router;
