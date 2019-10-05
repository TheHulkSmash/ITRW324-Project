const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const crypto = require('crypto')
//allows access to data passed from app
app.use(bodyParser.urlencoded({extended: false}))

//Global connection string
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Timetable@324',
    database: 'timetable'
})
//encryption
let hashPassword = function(password){
    return crypto.createHash('sha512').update(password).digest('hex');
}
//User notes
app.post('/notes',(req,res)=>{
    var studentNo = req.body.add_student
    var studentModule = req.body.add_module
    var title = req.body.add_title
    var note = req.body.add_note

    const queryString = "INSERT INTO user_notes(student_no,module_code,title,info) values(?,?,?,?) "

    connection.query(queryString,[studentNo,studentModule,title,note],(err,result,fields)=>
    {
        if(err)
        {
            console.log(err+"failed to add note");
        }

    })

});

//User Appointments


//gets user class information
app.post("/classes",(req,res)=>
{
    console.log("fetching user classes with id: " + req.body.add_student)

    var studentNo = req.body.add_student
    const queryString = "SELECT Distinct venue.venue_id, venue.building, venue.room, class.module_code, class.day_code, class.time_slot "+
    "FROM venue join class on venue.venue_id = class.venue_id "+
    "join user_module ON class.module_code = user_module.module_code "+
    "join timetable.user on user_module.student_no = ?"

    connection.query(queryString,[studentNo],(err,rows,fields)=>{
        if(err){
            console.log("failed to retrieve classes "+ err)
            res.sendStatus(500)
            return
        }
        if(rows && rows.length){
            console.log("fetched classes successfully")
            res.json(rows)
        }else
        {
            res.send("no classes have been found")
        }
    })
    //res.end()
})
 


//adding user modules
app.post("/modules",(req,res)=>
{
    
    var studentNo = req.body.add_student
    var studentModule = req.body.add_module

    //check to see if the module exist
    var queryString = "SELECT * From module where module_code = ?"

    connection.query(queryString,[studentModule],(err,rows,fields)=>{
        if(err){
            console.log("failed to retrieve classes "+ err)
            res.sendStatus(500)
            return
        }
        if(rows && rows.length)
        {
            queryString = "SELECT * From user_module where student_no = ? AND module_code = ?"
            connection.query(queryString,[studentNo,studentModule],(err,rows,fields)=>{
                if(err){
                    console.log("failed to retrieve classes "+ err)
                    res.sendStatus(500)
                    return
                }
            
                if(rows && rows.length)
                {
                    res.send("duplicate entry")
                }else
                {
                    queryString = "INSERT INTO user_module (student_no,module_code) VALUES (?,?)"
                    connection.query(queryString,[studentNo,studentModule],(err,rows,fields)=>{
                        if(err){
                            console.log("failed to insert classes"+ err)
                            res.sendStatus(500)
                            return
                        }
                            res.send("successfully added module")
                    })
                }
            })
            
        }else
        {
            console.log("module does not exist")
            res.send("module does not exist")
        }
    })
    
})

//Creating new user
app.post("/signup",(req,res)=>{

    var studentNo = req.body.add_student
    var studentEmail = req.body.add_email
    var studentPassword = req.body.add_password

    var queryString = "SELECT * from user where student_no = ?"
    
    connection.query(queryString,[studentNo],(err,results,fields)=>{
        if(err){
            console.log("failed to insert new user "+ err)
            res.sendStatus(500)
           return
        }
        if(results && results.length)
        {
            res.send('Duplicate student number')
            console.log("duplicate student number")
            return 
        }else
        {
            //Checking email unique
            queryString = "SELECT * from user where user_email = ?"
            connection.query(queryString,[studentEmail],(err,results,fields)=>{
                if(err){
                    console.log("failed to insert new user "+ err)
                    res.sendStatus(500)
                    return  
                }
                if(results && results.length)
                {
                    res.send('Duplicate email address')
                    console.log("duplicate email")
                    return
                }else
                {
                    //////////////////////////Encrypting Password/////////////
                    var encrypted_password = hashPassword(studentPassword);
                    ///////////////////////////////////////////////////////////
                    queryString = "INSERT INTO user (student_no,user_email,user_password,init_vec) VALUES (?,?,?,?)"
                    connection.query(queryString,[studentNo,studentEmail,encrypted_password,"init_vec"],(err,results,fields)=>{
                        if(err){
                            console.log("failed to insert new user "+ err)
                            res.sendStatus(500)
                            return  
                        }
                        console.log("new user created")
                        res.send('User created successfully')
                        res.end()
                    })  
                }   
            })
        }
    })
})

//Login with user password and student number
app.post("/login",(req,res)=> {

    var studentNo = req.body.add_student
    var studentPassword = req.body.add_password
    const queryString = "SELECT * FROM user where student_No = ? AND user_Password = ?"

    var encrypted_password = hashPassword(studentPassword);
    connection.query(queryString,[studentNo,encrypted_password],(err,rows,fields)=>{
        if(err){
            console.log("failed to retrieve user: "+ err)
            res.sendStatus(500)
            res.end()
        }
        if(rows && rows.length)
        {
            console.log("Login Successful")
            res.send("1")
        }else
        {
            console.log("Login unsuccessful")
            res.send("0")
        }
    })
})


 
app.listen(3000,()=>{
    console.log("server is live on 3000")
})