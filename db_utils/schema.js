var sqlite3 = require('sqlite3').verbose( );
var db = new sqlite3.Database('./zwicky.db');

db.serialize(function() {
	db.run("CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT , name VARCHAR, email VARCHAR, status INTEGER);");
	db.run("CREATE TABLE categories(id INTEGER PRIMARY KEY AUTOINCREMENT , name VARCHAR, notes TEXT, status INTEGER);");
	db.run("CREATE TABLE articles(id INTEGER PRIMARY KEY AUTOINCREMENT , article_id INTEGER, author_id INTEGER , category_id INTEGER , title VARCHAR, created VARCHAR, modified INTEGER, content TEXT, published INTEGER);");
});
