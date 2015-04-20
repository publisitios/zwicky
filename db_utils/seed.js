var sqlite3 = require('sqlite3').verbose( );
var db = new sqlite3.Database('../zwicky.db');

//db.run("INSERT INTO categories (name, notes, status) VALUES ('My Cat', 'Whatever Forever', 'inactive');")
db.run("INSERT INTO articles (article_id, category_id, author_id, title, content, published) VALUES (1, 2, 2, 'Whatever Forever', '#this is markdown', 'active';")
