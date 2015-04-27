// Include App Config
var config = require('./config.js');

// Include Templating Logic
var templates = require("./views.js");

// load application dependencies 
var express = require('express');
var sqlite3 = require('sqlite3');
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

// Manage Editors
app.get('/editors', function(req, res) {

    db.all('SELECT * FROM editors;', function(err, editors) {

    htmlTemplate = mustache.render(templates.view_editors(), {
        "templates": templates,
        "editors": editors
    });

        res.send(htmlTemplate);

    }); // end DB Select

}); // end app get

// Create a User
app.post('/editors/new', function(req, res) {

    editorName = req.body.editorName;
    editorEmail = req.body.editorEmail;
    
    if (req.body.editorStatus === undefined){
       editorStatus = "inactive";
    }
    else {
       editorStatus = req.body.editorStatus;
    }

    db.run("INSERT INTO editors (editor_name, editor_email, editor_status) VALUES ('" + editorName + "','" + editorEmail + "','" + editorStatus + "');");

    res.redirect(301, '/editors');

}); // end app delete

// View a Editor
app.get    ('/editors/:editor_id', function(req, res) {
    var editor_id = req.params.editor_id;
    
    db.all('SELECT * FROM editors WHERE editor_id = "'+ editor_id + '";', function(err, editors) {
    htmlTemplate = mustache.render(templates.edit_editor(), {
        "templates": templates,
        "editors": editors
    });

    res.send(htmlTemplate);

    }); // end DB Select

}); // end app put

// Edit  a User
app.put('/editors/:editor_id', function(req, res) {
    
    var editor_id = req.params.editor_id;
    var editorStatus;
    if (req.body.editorStatus === undefined){
       editorStatus = "inactive";
    }
    else {
       editorStatus = req.body.editorStatus;
    }

    db.run("UPDATE editors SET editor_name =  '" + req.body.editorName + "', editor_email =  '" + req.body.editorEmail +  "', editor_status =  '" + editorStatus + "' WHERE editor_id = " + editor_id + ";");
    
    res.redirect(301, '/editors');

}); // end app put

// delete a User
app.delete('/editors/:editor_id', function(req, res) {

    var editor_id = req.params.editor_id;
    db.run("DELETE FROM editors WHERE editor_id = " + editor_id + ";");
    res.redirect('/editors');

}); // end app delete


// CATEGORIES MODULE ROUTES

//View Categories
app.get('/categories', function(req, res) {
    
    db.all('SELECT * FROM categories;', function(err, categories) {

        htmlTemplate = mustache.render(templates.view_categories(), {
            "templates": templates,
            "categories": categories
        });

        res.send(htmlTemplate);

    }); // end DB Select

}); // end app get

// Create a Category
app.post('/categories', function(req, res) {

    var catStatus;
    if (req.body.catStatus === undefined){
       catStatus = "inactive";
    }
    else {
       catStatus = req.body.catStatus;
    }

    db.run("INSERT INTO categories (cat_name, cat_notes, cat_status) VALUES ('" + req.body.catName + "','" + req.body.catNotes + "','" + catStatus + "');");

    res.redirect(301, '/categories');

}); // end app post

//View  a Category
app.get('/categories/:cat_id', function(req, res) {

 var cat_id = req.params.cat_id;
    
    db.all('SELECT * FROM categories WHERE cat_id = "'+ cat_id + '";', function(err, category) {
        htmlTemplate = mustache.render(templates.edit_category(), {
            "templates": templates,
            "category": category
    });

    res.send(htmlTemplate);

    }); // end DB Select

}); // end app get

// Edit a Category
app.put('/categories/:catID', function(req, res) {
    var catID = req.params.catID;
    var catStatus;
    if (req.body.catStatus === undefined){
       catStatus = "inactive";
    }
    else {
       catStatus = req.body.catStatus;
    }
    db.run("UPDATE categories SET cat_name = '" + req.body.catName + "', cat_notes =  '" + req.body.catNotes +  "', cat_status =  '" + catStatus + "' WHERE cat_id = " + catID + ";");
    res.redirect(301, '/categories');

}); // end app put

// Delete an Category
app.delete('/categories/:catID', function(req, res) {
    var catID = req.params.catID;
    db.run("DELETE FROM categories WHERE cat_id = " + catID + ";");
    res.redirect('/categories');
}); // end app delete

// ARTICLE MODULE ROUTES

//View Articles
app.get('/articles', function(req, res) {

    db.all('SELECT * FROM articles LEFT JOIN editors ON articles.editor_id = editors.editor_id LEFT JOIN categories ON articles.category_id = categories.cat_id', function(err, articles) { 
                htmlTemplate = mustache.render(templates.view_articles(), {
                    "templates": templates,
                    "articles": articles,
                });

                res.send(htmlTemplate);

    }); // end DB Select articles

}); // end app get

// Create Article
app.get('/articles/new', function(req, res) {

    db.all('SELECT * FROM editors ;', function(err, editors) {   
        db.all('SELECT * FROM categories ;', function(err, categories) {    

            htmlTemplate = mustache.render(templates.create_article(), {
                "templates": templates,
                "editors": editors,
                "categories": categories
            });

            res.send(htmlTemplate);
        }); // end DB Select
    }); // end DB Select
}); // end app get

// save article
app.post('/articles', function(req, res) {

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

    db.run("INSERT INTO articles (title, editor_id, category_id, content, published, created, modified) VALUES ('" + req.body.title + "','" + req.body.editor_id + "','" + req.body.category_id + "','" + cleanContent + "','" + published + "','" + dateValue+ "','" +dateValue+"');");

    res.redirect(301, '/articles');


}); // end app get

//View Single Article
app.get('/articles/:articleID', function(req, res) {
    var articleID = req.params.articleID;

    db.all("SELECT * FROM articles LEFT JOIN editors ON articles.editor_id = editors.editor_id LEFT JOIN categories ON articles.category_id = categories.cat_id WHERE articles.id = '" + articleID + "';", function(err, article) {
        console.log(article);
        if (article !== undefined && article.length > 1 ){
        markdownRender = marked(article[0].content)}
        else{
        markdownRender = "#There is NO MarkDown !! ";
        console.log("No Mark Down!");
        }

        htmlTemplate = mustache.render(templates.view_article(), {
            "templates": templates,
            "article": article,
            "articleID": articleID,
            "markdownRender": markdownRender
         });

    res.send(htmlTemplate);

    }); // end DB Select

}); // end app get

// Edit Article
app.get('/articles/:articleID/edit', function(req, res) {

    var articleID = req.params.articleID;
    db.all("SELECT * FROM articles WHERE id = '" + articleID + "';", function(err, article) {
      db.all('SELECT * FROM editors ;', function(err, editors) {   
         db.all('SELECT * FROM categories ;', function(err, categories) {

            htmlTemplate = mustache.render(templates.edit_article(), {
                "templates": templates,
                "article": article,
                "editors": editors,
                "categories": categories,
                "articleID": articleID
            });

        res.send(htmlTemplate);

         }); // end DB Select
      }); // end DB Select
    }); // end DB Select

}); // end app get


// Update an Article
app.put('/articles/:articleID', function(req, res) {
    var articleID = req.params.articleID;

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
    cleanContent = req.body.content.replace(/'/g, "''");
    db.run("UPDATE articles SET title =  '" + req.body.title + "', editor_id =  '" + req.body.editor_id +  "', category_id =  '" + req.body.category_id + "', modified = '" + dateValue + "', created = '" + req.body.created + "', content = '" + cleanContent + "', published = '" + published+ "' WHERE id = " + articleID + ";");
    
    // send email notification to editor
    db.all("SELECT editor_email FROM editors WHERE editor_id = '" + req.body.editor_id + "';", function(err, editor_email) {  
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

    res.redirect(301, '/articles/' + articleID );

}); // end app put

// delete an Article
app.delete('/articles/:articleID', function(req, res) {

    var articleID = req.params.articleID;
    db.run("DELETE FROM articles WHERE id = " + articleID + ";");

    res.redirect(301, '/articles');

}); // end app delete

// start the web server
    app.listen(config.express_port, function() {
        console.log("LISTENING ON PORT : " + config.express_port);
    }); 

// fin :)