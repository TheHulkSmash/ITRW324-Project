var mysql = require('mysql');
var express = require('express');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'reinard',
    database : 'timetable'
});

connection.connect(function(err) {
    // in case of error
    if(!!err){
        console.log('error');
    }
    else{
         console.log('connected');
    }
});

$query = 'SELECT * from day ';

connection.query($query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        return;
    }

    console.log("Query succesfully executed: ", rows);
});
//app.listen(3000, ()=> console.log('Express server is running at port 3000'));

/*app.get('/user', (res,req) => {
    mysqlconnection.query('SELECT * FROM user', (err, rows, fields)=>{
        if(!err)
            console.log(rows);
        else
            console.log(err);
    })
});*/