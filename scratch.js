var sqlite3 = require('sqlite3');
// SQLite conection 
var db = new sqlite3.Database('./zwicky.db');

db.all('SELECT * FROM categories ;', function(err, categories) { 
	db.all('SELECT * FROM users ;', function(err, users) { 

						if (categories != undefined){
                        categories.forEach (function(e){
                            if (id === e.id){ 
                                console.log(e.name);
                            }
                        });
                        }
                
                    
                        if (users != undefined){
                        users.forEach (function(e){
                            if (id === e.id){ 
                                console.log(e.name);
                            }
                        });
                        }
                

}); // end DB Select

}); // end DB Select