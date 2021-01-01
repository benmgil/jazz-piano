let mysql = require('mysql');
const express = require('express');
const router = express.Router();
const app = express();
const port = 8000;

app.use(
    function(req,res,next){
        console.log(req);
        next();
    }
)
app.use(express.json());
//app.use(express.static('public'));

let con = mysql.createConnection({
  host: 'localhost',
  user: 'php-user',
  password: '!No@Disk#Space$256',
  database: 'keyboard'
});

//responding to create account request
app.post("/create_account", function(req,res){
  let username = req.body.username;
  let password = req.body.password;

  //check for invalid input
  if(username == "" || password == "" ){
    res.json({
      success: false,
      message: "Username and password cannot be empty"
    });
  }
  else if(username.length > 30 || password.length > 60){
    res.json({
      success: false,
      message: "Username or password is too long"
    });
  }
  //if valid, check if username already exists in database
  else{
    con.query('SELECT * FROM users WHERE username = ?', [username], function(err, rows){
      if(err) throw err;
      //if not, insert it
      if(rows.length == 0){
        con.query(
          'INSERT INTO users (username, password, favorites, recents) values (?, ?, ?, ?)',
          [username, password, '[]', '[]'],
          function(err, result) {
            if(err){
              throw err;
            }
            else{
              res.json({
                success: true
              })
            }
          }
        );
      }
      else{
        res.json({success:false, message: "That username already exists"});
      }
    });
  }
})

//responding to login request
app.post("/login", function(req,res){
    console.log("ohho");
  let username = req.body.username;
  let password = req.body.password;

  //check for invalid input
  if(username == "" || password == "" ){
    res.json({
      success: false,
      message: "Username and password cannot be empty"
    });
  }
  else if(username.length > 30 || password.length > 60){
    res.json({
      success: false,
      message: "Username or password is too long"
    });
  }
  //if valid, check that user with that username&password exists and if so send success
  else{
    con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(err, rows){
      if(err) throw err;
      if(rows.length == 1){
        res.json({
          success:true,
          favorites: rows[0].favorites,
          recents: rows[0].recents

        });
      }
      //if not, send error
      else{
        res.json({success:false, message: "Username or password is incorrect"});
      }
    });
  }
})

//request to update favorites
app.post("/update_favorites", function(req,res){
  let username = req.body.username;
  let password = req.body.password;
  let favorites = JSON.stringify(req.body.favorites);
  //update database with inputted data
  con.query('UPDATE users SET favorites = ? WHERE username = ? AND password = ?',
  [favorites, username, password], function(err){
    if (err) throw err;
  })
})

//request to update recents
app.post("/update_recents", function(req,res){
  let username = req.body.username;
  let password = req.body.password;
  let recents = JSON.stringify(req.body.recents);
  //update database with inputted data
  con.query('UPDATE users SET recents = ? WHERE username = ? AND password = ?',
  [recents, username, password], function(err){
    if (err) throw err;
  })

})

app.listen(port);
