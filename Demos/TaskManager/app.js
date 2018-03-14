//Cole Tomlinson
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();

// Using a Javascript object as a hashmap to hold the Task entries
var entries = {};
app.locals.entries = entries;

var nextId = 1;

// Constructor function for a Task object
var Task = function (n, a, b) {
	this.id = nextId++;
	this.task = n;
	this.date = a;
  this.type = b;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Note: extended:true

app.get("/", function(req, res) {
  // Send the page itself to the browser
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/script.js", function (req,res){
  res.sendFile(path.join(__dirname, 'script.js'));
});

app.get("/load", function(req, res) {
  res.send(entries);
});

app.post("/add", function(req, res) {
  var newTask = new Task(req.body.task, req.body.date, req.body.type);
  // Use the id field as a key to the object/hashmap
  entries[newTask.id] = newTask;
  // Send the updated list of Persons back to the client page.
  res.send(entries);
});

app.post("/delete", function(req, res) {
  var xlist = req.body.xlist;
  xlist.forEach( (ele) => {delete entries[ele];} );
  res.send(entries);
});

// Catch all middleware for requests that don't match an acceptable pattern
app.use(function(req, res) {
  res.status(404).render("404");
});

// Fire up the server
app.listen(3000, function() {
  console.log("Express app started on port 3000.");
});
