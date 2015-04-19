var sqlite3 = require('sqlite3').verbose( );
var db = new sqlite3.Database('./playlist.db');

db.run("INSERT INTO playlist (title, rating, video_ID, video_URL) VALUES ('My Youtube Video', 3 , 'TklQzZ1JQe0', 'https://www.youtube.com/watch?v=TklQzZ1JQe0');")
