var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

require('./config/passport')(passport);
import "../config/passport";

passport.use(
    'local-signup',
    new LocalStrategy({
     usernameField : 'username',
     passwordField: 'password',
     passReqToCallback: true
    },
    function(req, username, password, done){
     connection.query("SELECT * FROM user WHERE username = ? ", 
     [username], function(err, rows){
      if(err)
       return done(err);
      if(rows.length){
       return done(null, false, req.flash('signupMessage', 'That is already taken'));
      }else{
       var newUserMysql = {
        username: username,
        password:password
        //password: bcrypt.hashSync(password, null, null)
       };
  
       var insertQuery = "INSERT INTO user (username, password) values (?, ?)";
  
       connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
        function(err, rows){
         newUserMysql.username = rows.username;
  
         return done(null, newUserMysql);
        });
      }
     });
    })
   );