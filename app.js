// load application dependencies 
var express = require('express');
var sqlite3 = require('sqlite3');
var fs = require('fs');
var mustache = require('mustache');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var request = require('request');

var db = new sqlite3.Database('./playlist.db');
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride('_method'));

var hello = "Hello World!"


// Homepage
app.get('/', function(req, res) {
    res.send(hello);
});

// About Page
app.get('/about', function(req, res) {
    res.send(hello);
});

// Users 

// Create a User
app.post('/users/create', function(req, res) {
    res.send(hello);
});

// Edit  a User
app.put('/users/:id', function(req, res) {
    res.send(hello);
});

// delete a User
app.delete('/users/:id', function(req, res) {
    res.send(hello);
});

// Articles 

//View Single Article
app.get('/articles/:id', function(req, res) {
    res.send(hello);
});

// Create Article
app.post('/articles/create', function(req, res) {
    res.send(hello);
});

// Edit Article
app.put('/articles/:id', function(req, res) {
    res.send(hello);
});

// delete an Article
app.delete('/articles/:id', function(req, res) {
    res.send(hello);
});


// Categories

//View Articles Within a Category
app.get('/categories/:id', function(req, res) {
    res.send(hello);
});

// Create a Category
app.post('/categories/create', function(req, res) {
    res.send(hello);
});

// Edit a Category
app.put('/categories/:id', function(req, res) {
    res.send(hello);
});

// Delete an Category
app.delete('/categories/:id', function(req, res) {
    res.send(hello);
});



app.listen(8080, function() {
  console.log("LISTENING ON PORT 8080!");
});