const { Pool } = require("pg");
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const secrets = require("./secrets.js");
const app = express();
const cors = require('cors');

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "migracode-final-project",
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


app.use(cors())


app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/../Front_End/login.html'));
});

app.get("/users", (req, res) => {
	pool
	  .query("SELECT * FROM users")
	  .then(result => res.json(result.rows))
	  .catch(err => res.json(err, 404));
  });

app.post('/users', function(request, response) {
	const username = request.body.name;
	const password = request.body.password;
	if (username && password) {
		pool.query("SELECT * FROM users WHERE name = $1 AND password = $2", [username, password],
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

  app.get('/reg', function(req,res){
    res.sendFile(path.join(__dirname + '/../Front_End/login.html'));
});

app.post('/reg', function(req,res){
    const username= req.body.name;
    const email = req.body.email;
	const password = req.body.password;

	pool.query("SELECT * FROM users WHERE email = $1", [email])
	    .then(result => {
	      if (result.rows.length > 0) {
	    	return res.status(400)
				      .send("A user with the same email already exists!");
		    }else{ const query = "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)" ;
			       const params = [username,email,password];
	pool
	.query(query, params)
	.then(() => res.send("Signup Success"))
	.catch(e => res.status(500).send(e));
	 
	 }
	 pool
	 .query(query, params)
	 .then(() =>res.redirect('/'));
});
});

/*app.get("/services", (req, res) => {
	const text = req.query.text;
	let words = text.split('')


	 let query = "SELECT s.*, h.text from services  s "+
	 "join users u on u.id=s.providerid "+
	 "join service_tags  t on t.service_id = s.id "+
	 "join hashtags h on h.id=t.hashtag_id "

	  let params = [];

	  if (text) {
		params = [`%${text}%`];
		query += ` where h.text ilike $1`;
	}
	pool
    .query(query, params)
    .then(result => res.json(result.rows))
    .catch(err => res.json(err, 500));

});*/

	app.get('/services', function (request, response) {
		const text = request.query.text;
		// text = u:eduard h:dogs h:vacations u:ward u:housni
		// 1 - separate each word and put it in an array
		var words = text.split(' '); // words = ['u:eduard' 'h:dogs' 'h:vacations' 'u:ward' 'u:housni']

		// 2 - determine which ones are hastags and which ones are user names
		var hashtags = words // hashtags = ['dogs' 'vacations']
			.filter((word, index) => word.startsWith(''))
			.map(word => word.replace('h:',''));h:
		var users = words // users = ['eduard' 'ward' 'housni'] 
			.filter((word, index) => word.startsWith('u:'))
			.map(word => word.replace('u:', ''));
		// 3 - put them in our query
		// SELECT + JOIN

		var query = `SELECT s.*, h.text, pro.name as pro from services s
		join users pro on pro.id=s.provider_id 
		join service_tags  t on t.service_id = s.id 
		join hashtags h on h.id=t.hashtag_id 
	union 
	SELECT s.*, h.text, rec.name as rec from services s
		join users rec on rec.id=s.receiver_id
		join service_tags  t on t.service_id = s.id 
		join hashtags h on h.id=t.hashtag_id `;
		

		//const hashtagPlaceholders = hashtags.map ((h, index) => `$${index + 1}`).join(',')
		function hashtagPlaceholders(hashtag) {
			return `(${hashtags.map((h, i) => `$${i + 1}`).join(",")})`;}
	
		 const offset = hashtags.length;
		 function userPlaceholders(users, offset = 0) {
			return `(${users.map((users, i) => `$${i+1+offset}`).join(",")})`;}
		 //const userPlaceholders = users.map((u,i) => `$${i+1+offset}`).join(",");

		 let quyry =` WHERE h.text = ${hashtagPlaceholders(hashtags)} 
		or pro.name = ${userPlaceholders(users, offset)} `

		pool
    .query(query)
    .then(result => response.json(result.rows))
	.catch(err => response.status(500).json(err));

	});
	

  app.post("/services", (req, res) => {
	const newproviderId = req.body.provider_id;
    const newreceiverId = req.body.receiver_id;
	const newpoints = req.body.points;
	const newcontent = req.body.content;
    const state= req.body.state;
	const start_date = req.body.start_date;
	const end_date= req.body.end_date
	const review = req.body.review;
	const comment = req.body.comment;
	pool.query("SELECT * FROM services WHERE content = $1", [newcontent])
	    .then(result => {
	      if (result.rows.length < 150) {
	    	return res.status(400)
				      .send("an invalid request");
		    }else{ const query =
	  "insert into services (provider_id,receiver_id,points, content ,state,start_date,end_date,review,comment) Values ($1,$2, $3,$4,$5,$6,$7,$8,$9 )";
	const parameters = [newproviderId,newreceiverId, newpoints ,newcontent, state, start_date,end_date,review,comment ];
  
	pool
	  .query(query, parameters)
	  .then(result => res.send("request created!"))
	  .catch(err => res.json(err, 500));
			}
  });
});

  app.listen(5000, function() {
	console.log("Server is listening on port 5000. Ready to accept requests!");
  });