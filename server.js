const { Pool } = require("pg");
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const secrets = require("./secrets.js");
const app = express();
var pg = require('pg');
const db_connection = "postgres://postgres:Password@localhost/nodelogin";

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "nodelogin",
	password: secrets.dbPassword,
	port: 5432
  });

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('../Front_End/public'))
 

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/../Front_End/login.html'));
});

app.post('/auth', function(request, response) {
	const username = request.body.username;
	const password = request.body.password;
	if (username && password) {
		pool.query("SELECT * FROM accounts WHERE username = $1 AND password = $2", [username, password],
		 function(error, results, fields)
		  {
			  console.log(error);
			  console.log(results);
			  console.log(fields);

			 if(results.rowCount > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/logout', function (req, res) {
	delete req.session.user_id;
	res.redirect('/login');
  });

app.get("/users", (req, res) => {
	pool
	  .query("SELECT * FROM users")
	  .then(result => res.json(result.rows))
	  .catch(err => res.json(err, 404));
  });

  app.post("/users", (req, res) => {
	const name = req.body.username;
	const email = req.body.email;
  
	const query =
	  "INSERT INTO users(username, email) VALUES ($1, $2)";
	const parameters = [name,email];
  
	pool
	  .query(query, parameters)
	  .then(result => res.send("user created!"))
	  .catch(err => res.json(err, 500));
  });

  app.put("/users/:userId", (req, res) => {
	const userId = req.params.userId;
	const name = req.body.username;
	const email = req.body.email;
  
	const query =
	  "UPDATE users SET username=$1, email=$2 where id = $3";
	const parameters = [name,email, userId];
  
	pool
	  .query(query, parameters)
	  .then(result => res.send("user updated!"))
	  .catch(err => res.json(err, 500));
  });
  
  app.get("/userss/:userId", (req, res) => {
	const userId = req.params.userId;
  
	pool
	  .query("SELECT * from userss where id = $1", [userId])
	  .then(result => res.json(result.rows))
	  .catch(err => res.json(err, 500));
  });

  app.get('/url', function(req,res){
    res.sendFile(path.join(__dirname + '/../Front_End/register.html'));
});

app.post('/url', function(req,res){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const signup_client = new pg.Client(db_connection);;
    signup_client.connect(function (err){
    if(err){
    console.log('Could not connect to postgresql on signup',err);
    }else{
    signup_client.query('INSERT INTO accounts(username,email,password) VALUES ($1,$2,$3)',
    [username,email,password], function (err){
    if(err){
     console.log('Insert error in signup', err);
    }else{
     console.log('Signup Success');
     res.redirect('/');
     }
    });
     }
    });
});
  
  app.listen(3000, function() {
	console.log("Server is listening on port 3000. Ready to accept requests!");
  });