const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

const app = express();
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
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
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
  
  

  app.listen(3000, function() {
	console.log("Server is listening on port 3000. Ready to accept requests!");
  });

