##Article Routes
Following REST convention

###Operate on the Collection
####GET /articles
return a list of all records

####GET /articles/new
return a form for creating a new record

####POST /articles
submit fields for creating a new record

###Operate on a Record
####GET /articles/1
return the first record

####DELETE /articles/1
destroy the first record

####POST /articles/1?_method=DELETE
alias for DELETE, to compensate for browser limitations

####GET /articles/1/edit
return a form to edit the first record

####PUT /articles/1
submit fields for updating the first record

####POST /articles/1?_method=PUT
alias for PUT, to compensate for browser limitations