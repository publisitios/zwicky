var sqlite3 = require('sqlite3');
// SQLite conection 
var db = new sqlite3.Database('./zwicky.db');

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
              }); // end DB Select users 
        }); // end DB Select categories