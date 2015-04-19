// load application dependencies 
var express = require('express');
var sqlite3 = require('sqlite3');
var fs = require('fs');
var mustache = require('mustache');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var request = require('request');

var db = new sqlite3.Database('./zwicky.db');
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(methodOverride('_method'));

// Include Templating Logic
var templates = require("./views.js");

// Homepage
app.get('/', function(req, res) {

    htmlTemplate = mustache.render(templates.index(), {
        "templates": templates
    });

    res.send(htmlTemplate);


}); // end app get

// About Page
app.get('/about', function(req, res) {

    htmlTemplate = mustache.render(templates.about(), {
        "templates": templates
    });

    res.send(htmlTemplate);

}); // end app get

// Contact Page
app.get('/markdown', function(req, res) {

    htmlTemplate = mustache.render(templates.markdown(), {
        "templates": templates
    });

    res.send(htmlTemplate);

}); // end app get

// Users 

// Manage Users
app.get('/users', function(req, res) {

    db.all('SELECT * FROM users;', function(err, users) {

    htmlTemplate = mustache.render(templates.view_users(), {
        "templates": templates,
        "users": users
    });

        res.send(htmlTemplate);

    }); // end DB Select

}); // end app get

// Create a User
app.post('/users/create', function(req, res) {

    userName = req.body.userName;
    userEmail = req.body.userEmail;
    userStatus = req.body.userStatus;

    db.run("INSERT INTO users (name, email, status) VALUES ('" + userName + "','" + userEmail + "','" + userStatus + "');");

    res.redirect(301, '/users');


}); // end app delete

// View a User
app.get    ('/users/:id', function(req, res) {
    var id = req.params.id;
    
    db.all('SELECT * FROM users WHERE id = "'+ id + '";', function(err, users) {
    htmlTemplate = mustache.render(templates.edit_user(), {
        "templates": templates,
        "users": users
    });

    res.send(htmlTemplate);

    }); // end DB Select

}); // end app put

// Edit  a User
app.put('/users/edit/:id', function(req, res) {
    
    var id = req.params.id;
    var userStatus;
    if (req.body.userStatus === undefined){
       userStatus = "inactive";
    }
    else {
       userStatus = req.body.userStatus;
    }
    console.log(userStatus)
    db.run("UPDATE users SET name =  '" + req.body.userName + "', email =  '" + req.body.userEmail +  "', status =  '" + userStatus + "' WHERE id = " + id + ";");
    res.redirect(301, '/users');

}); // end app put

// delete a User
app.delete('/users/delete/:id', function(req, res) {

    var id = req.params.id;
    db.run("DELETE FROM users WHERE id = " + id + ";");
    res.redirect('/users');

}); // end app delete

// Articles 

//View Articles
app.get('/articles', function(req, res) {

    var template = fs.readFileSync('./views/view-articles.html', 'utf-8'); // load HTML template
    htmlTemplate = mustache.render(template, {

    }); // end mustache

    res.send(htmlTemplate);

}); // end app get

//View Single Article
app.get('/articles/:id', function(req, res) {

    var template = fs.readFileSync('./views/article.html', 'utf-8'); // load HTML template

    htmlTemplate = mustache.render(template, {

    }); // end mustache

    res.send(htmlTemplate);

}); // end app get

// Create Article
app.post('/articles/create', function(req, res) {

    var template = fs.readFileSync('./views/create-article.html', 'utf-8'); // load HTML template
    
    htmlTemplate = mustache.render(template, {

    }); // end mustache

    res.send(htmlTemplate);

}); // end app post

// Edit Article
app.put('/articles/:id', function(req, res) {

    var template = fs.readFileSync('./views/manage-articles.html', 'utf-8'); // load HTML template
    
    htmlTemplate = mustache.render(template, {

    }); // end mustache

    res.send(htmlTemplate);

}); // end app put

// delete an Article
app.delete('/articles/:id', function(req, res) {
    res.redirect(301, '/articles');

}); // end app delete


// Categories

//View Categories
app.get('/categories', function(req, res) {

    var template = fs.readFileSync('./views/categories.html', 'utf-8'); // load HTML template
    
    htmlTemplate = mustache.render(template, {

    }); // end mustache

    res.send(htmlTemplate);

}); // end app get

//View Articles Within a Category
app.get('/categories/:id', function(req, res) {

    var template = fs.readFileSync('./views/categories.html', 'utf-8'); // load HTML template
  
    htmlTemplate = mustache.render(template, {

    }); // end mustache

    res.send(htmlTemplate);

}); // end app get

// Create a Category
app.post('/categories/create', function(req, res) {

    var template = fs.readFileSync('./views/create-category.html', 'utf-8'); // load HTML template
    
    htmlTemplate = mustache.render(template, {

    }); // end mustache

    res.send(htmlTemplate);

}); // end app post

// Edit a Category
app.put('/categories/:id', function(req, res) {
    res.redirect(301, '/categories');
}); // end app put

// Delete an Category
app.delete('/categories/:id', function(req, res) {
    res.redirect(301, '/categories');
}); // end app delete


// static routes for calling bootstrap
app.use(express.static(__dirname + '/bootstrap'));

app.listen(8080, function() {
    console.log("LISTENING ON PORT 8080!");
}); // end app listed