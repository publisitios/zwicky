// load application dependencies 
var express = require('express');
var sqlite3 = require('sqlite3');
var fs = require('fs');
var mustache = require('mustache');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var request = require('request');
var marked = require('marked');
// SQLite conection 
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
    
    if (req.body.userStatus === undefined){
       userStatus = "inactive";
    }
    else {
       userStatus = req.body.userStatus;
    }

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
    console.log(userStatus);
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

    db.all('SELECT * FROM articles;', function(err, articles) {

    htmlTemplate = mustache.render(templates.view_articles(), {
        "templates": templates,
        "articles": articles
    });

        res.send(htmlTemplate);

    }); // end DB Select

}); // end app get


// Create Article
app.get('/articles/create', function(req, res) {

db.all('SELECT * FROM users ;', function(err, users) {   
db.all('SELECT * FROM categories ;', function(err, categories) {    
    console.log(users);
    console.log(categories);
    htmlTemplate = mustache.render(templates.create_article(), {
        "templates": templates,
        "users": users,
        "categories": categories
    });

        res.send(htmlTemplate);
}); // end DB Select
}); // end DB Select
}); // end app get


app.post('/articles/create', function(req, res) {

    var currentDate = new Date();
    var day = currentDate.getDate();
    if(day < 10) day = "0" + day;
    var month = currentDate.getMonth() + 1;
    if(month < 10) month = "0" + month;
    var year = currentDate.getFullYear();
    var dateValue = (year + "-" + month + "-" + day);

    var published;
    if (req.body.published === undefined){
       published = "inactive";
    }
    else {
       published = req.body.published;
    }

    db.run("INSERT INTO articles (title, author_id, category_id, content, published, created, modified) VALUES ('" + req.body.title + "','" + req.body.author_id + "','" + req.body.category_id + "','" + req.body.content + "','" + published + "','" + dateValue+ "','" +dateValue+"');");

    res.redirect(301, '/articles');


}); // end app get

//View Single Article
app.get('/articles/:id', function(req, res) {
var id = req.params.id;
db.all("SELECT * FROM articles WHERE id = '" + id + "';", function(err, article) {
    console.log(article);
    htmlTemplate = mustache.render(templates.view_article(), {
        "templates": templates,
        "article": article,
        "id": id
    });

        res.send(htmlTemplate);

    }); // end DB Select

}); // end app get

// Edit Article
app.get('/articles/edit/:id', function(req, res) {

var id = req.params.id;
db.all("SELECT * FROM articles WHERE id = '" + id + "';", function(err, article) {
    db.all('SELECT * FROM users ;', function(err, users) {   
db.all('SELECT * FROM categories ;', function(err, categories) {
    console.log(article);
    htmlTemplate = mustache.render(templates.edit_article(), {
        "templates": templates,
        "article": article,
        "users": users,
        "categories": categories,
        "id": id
    });

        res.send(htmlTemplate);

    }); // end DB Select
}); // end DB Select
    }); // end DB Select

}); // end app get


// Update an Article
app.put('/articles/edit/:id', function(req, res) {
    var id = req.params.id;

    var currentDate = new Date();
    var day = currentDate.getDate();
    if(day < 10) day = "0" + day;
    var month = currentDate.getMonth() + 1;
    if(month < 10) month = "0" + month;
    var year = currentDate.getFullYear();
    var dateValue = (year + "-" + month + "-" + day);

    var published;
    if (req.body.published === undefined){
       published = "inactive";
    }
    else {
       published = req.body.published;
    }

    db.run("UPDATE articles SET title =  '" + req.body.title + "', author_id =  '" + req.body.author_id +  "', category_id =  '" + req.body.category_id + "', modified = '" + dateValue + "', created = '" + req.body.created + "', content = '" + req.body.content+ "', published = '" + published+ "' WHERE id = " + id + ";");
    res.redirect(301, '/articles/'+id);

}); // end app put

// delete an Article
app.delete('/articles/:id', function(req, res) {
    res.redirect(301, '/articles');

}); // end app delete


// Categories

//View Categories
app.get('/categories', function(req, res) {
    
    db.all('SELECT * FROM categories ;', function(err, categories) {

    htmlTemplate = mustache.render(templates.view_categories(), {
        "templates": templates,
        "categories": categories
    });

        res.send(htmlTemplate);

    }); // end DB Select


}); // end app get

// Create a Category
app.post('/categories/create', function(req, res) {

    var catStatus;
    if (req.body.catStatus === undefined){
       catStatus = "inactive";
    }
    else {
       catStatus = req.body.catStatus;
    }

    db.run("INSERT INTO categories (name, notes, status) VALUES ('" + req.body.catName + "','" + req.body.catNotes + "','" + catStatus + "');");

    res.redirect(301, '/categories');

}); // end app post

//View  a Category
app.get('/categories/:id', function(req, res) {

 var id = req.params.id;
    
    db.all('SELECT * FROM categories WHERE id = "'+ id + '";', function(err, category) {
    htmlTemplate = mustache.render(templates.edit_category(), {
        "templates": templates,
        "category": category
    });

    res.send(htmlTemplate);

    }); // end DB Select

}); // end app get

// Edit a Category
app.put('/categories/edit/:id', function(req, res) {
    var id = req.params.id;
    var catStatus;
    if (req.body.catStatus === undefined){
       catStatus = "inactive";
    }
    else {
       catStatus = req.body.catStatus;
    }
    db.run("UPDATE categories SET name = '" + req.body.catName + "', notes =  '" + req.body.catNotes +  "', status =  '" + catStatus + "' WHERE id = " + id + ";");
    res.redirect(301, '/categories');

}); // end app put

// Delete an Category
app.delete('/categories/delete/:id', function(req, res) {
    var id = req.params.id;
    db.run("DELETE FROM categories WHERE id = " + id + ";");
    res.redirect('/categories');
}); // end app delete


// static routes for calling bootstrap
app.use(express.static(__dirname + '/bootstrap'));

app.listen(8080, function() {
    console.log("LISTENING ON PORT 8080!");
}); // end app listed