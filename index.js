const mysql = require('mysql');

var mysqlconnection = mysql.createConnection({
    host: 'localhost',
    user: '', 
    password: ' ',
    database: ''
})

mysqlconnection.connect((err) =>{
    if(!err)
        console.log('Database is connected.');
    else
        console.log('Database is not connected \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, ()=> console.log('Express server is running at port 3000'));

app.get('/employees', (res,req) => {
    mysqlconnection.query('SELECT * FROM Employees', (err, rows, fields)=>{
        if(!err)
            console.log(rows);
        else
            console.log(err);
    })
});