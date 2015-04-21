// Include App Config
var config = require('./config.js');

// Include Templating Logic
var templates = require("./views.js");

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
var sendgrid = require("sendgrid")(config.sendgrid_api_user, config.sendgrid_api_key);

// SQLite conection 
var db = new sqlite3.Database('./zwicky.db');

// Express
var app = express();
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(methodOverride('_method'));

    // static routes for calling bootstrap
    app.use(express.static(__dirname + '/bootstrap'));

// CONTENT PAGES ROUTES

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


// USER MODULE ROUTES

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

    db.run("UPDATE users SET name =  '" + req.body.userName + "', email =  '" + req.body.userEmail +  "', status =  '" + userStatus + "' WHERE id = " + id + ";");
    
    res.redirect(301, '/users');

}); // end app put

// delete a User
app.delete('/users/delete/:id', function(req, res) {

    var id = req.params.id;
    db.run("DELETE FROM users WHERE id = " + id + ";");
    res.redirect('/users');

}); // end app delete


// CATEGORIES MODULE ROUTES

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

// ARTICLE MODULE ROUTES

//View Articles
app.get('/articles', function(req, res) {

    db.all('SELECT * FROM articles;', function(err, articles) { 
        db.all('SELECT * FROM categories ;', function(err, categories) { 
            db.all('SELECT * FROM users ;', function(err, users) { 

                var functions ={};

                functions.getUserById = function (user_id){
                    console.log("looking for user");
                    users.forEach (function(e){
                        if (user_id == e.id){ 
                            console.log(e.name);
                            return e.name;
                        }
                    });

                };
                functions.getCategoryById = function (category_id){

                        console.log("looking for cats in ID : " + category_id);
                        console.log("array legnth : " + categories.length);
                    
                        categories.forEach (function(e){
                        console.log(category_id);
                            if (category_id === e.id){ 
                                var categoryName = e.name; 
                                console.log(categoryName);
                            }
                        });

                        //return categoryName; render(text)
                        
                    };
                    

                htmlTemplate = mustache.render(templates.view_articles(), {
                    "templates": templates,
                    "articles": articles,
                    "categories": categories,
                    "users": users,
                    "functions" : functions
                });


                res.send(htmlTemplate);

            }); // end DB Select users 
        }); // end DB Select categories
    }); // end DB Select articles

}); // end app get

//View Single Article
app.get('/articles/:id', function(req, res) {
    var id = req.params.id;
    db.all("SELECT * FROM articles WHERE id = '" + id + "';", function(err, article) {

        if (article[0] !== undefined){
        markdownRender = marked(article[0].content);}
        else{
         markdownRender = "#woouuw  gyeeeaaa !! ";
        console.log("No Mark Down!");
        }

        htmlTemplate = mustache.render(templates.view_article(), {
            "templates": templates,
            "article": article,
            "id": id,
            "markdownRender": markdownRender
         });

    res.send(htmlTemplate);

    }); // end DB Select

}); // end app get

// Create Article
app.get('/articles/create/', function(req, res) {

    db.all('SELECT * FROM users ;', function(err, users) {   
        db.all('SELECT * FROM categories ;', function(err, categories) {    

            htmlTemplate = mustache.render(templates.create_article(), {
                "templates": templates,
                "users": users,
                "categories": categories
            });

            res.send(htmlTemplate);
        }); // end DB Select
    }); // end DB Select
}); // end app get

// save article
app.post('/articles/save', function(req, res) {

    // get current date
    var currentDate = new Date();
    var day = currentDate.getDate();
    if(day < 10) day = "0" + day;
    var month = currentDate.getMonth() + 1;
    if(month < 10) month = "0" + month;
    var year = currentDate.getFullYear();
    var dateValue = (year + "-" + month + "-" + day);

    // published checkbox logic
    var published;
    if (req.body.published === undefined){
       published = "inactive";
    }
    else {
       published = req.body.published;
    }

    cleanContent = req.body.content.replace(/'/g, "''");

    db.run("INSERT INTO articles (title, author_id, category_id, content, published, created, modified) VALUES ('" + req.body.title + "','" + req.body.author_id + "','" + req.body.category_id + "','" + cleanContent + "','" + published + "','" + dateValue+ "','" +dateValue+"');");

    res.redirect(301, '/articles');


}); // end app get

// Edit Article
app.get('/articles/edit/:id', function(req, res) {

    var id = req.params.id;
    db.all("SELECT * FROM articles WHERE id = '" + id + "';", function(err, article) {
      db.all('SELECT * FROM users ;', function(err, users) {   
         db.all('SELECT * FROM categories ;', function(err, categories) {

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

    // get modified date
    var currentDate = new Date();
    var day = currentDate.getDate();
    if(day < 10) day = "0" + day;
    var month = currentDate.getMonth() + 1;
    if(month < 10) month = "0" + month;
    var year = currentDate.getFullYear();
    var dateValue = (year + "-" + month + "-" + day);

    // published checkbox logig 
    var published;
    if (req.body.published === undefined){
       published = "inactive";
    }
    else {
       published = req.body.published;
    }
    // write to DB
    cleanContent = req.body.content.replace(/'/g, "\'");
    db.run("UPDATE articles SET title =  '" + req.body.title + "', author_id =  '" + req.body.author_id +  "', category_id =  '" + req.body.category_id + "', modified = '" + dateValue + "', created = '" + req.body.created + "', content = '" + cleanContent + "', published = '" + published+ "' WHERE id = " + id + ";");
    
    // send email notification to editor
    db.all("SELECT email FROM users WHERE id = '" + req.body.author_id + "';", function(err, editor_email) {  
        console.log(editor_email[0].email);

        var email = {
            to: editor_email[0].email, 
            from: config.sendgrid_from,
            subject: "Zwicky Article Update",
            text: "One of your articles on zwicky has been edited!"
            };

        console.log(email);

        sendgrid.send(email, function(err, json) {
          if (err) { return console.log(err); }
          console.log(json);
        });

    }); // end db select

    res.redirect(301, '/articles/' + id );

}); // end app put

// delete an Article
app.delete('/articles/:id', function(req, res) {

    var id = req.params.id;
    db.run("DELETE FROM articles WHERE id = " + id + ";");

    res.redirect(301, '/articles');

}); // end app delete

// start the web server
    app.listen(config.express_port, function() {
        console.log("LISTENING ON PORT : " + config.express_port);
    }); 

// fin :)