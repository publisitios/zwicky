# ZWICKY WIKI


## An Internally facing Wiki for organizations.


Named in Honor of Fritz

Fritz Zwicky
“If ever a competition were held for the most unrecognized genius of twentieth century astronomy, the winner surely would be Fritz Zwicky (1898–1974)”

wi·ki
ˈwikē/
noun
a website that allows collaborative editing of its content and structure by its users.


#ROUTES

###View Homepage

GET /

The user is prompted to select his username and log in  

He can also select to view the user CRUD page



### Articles

GET


View Single Article

GET

POST CREATE Article


PUT Edit Article


DELETE an Article

DELETE

### Categories

Create a Category

Edit a Category

Delete a Category



### Users

Create a User

Edit a User //  may be better to just create or delete, (what if a user has posts made and is deleted??)

Delete a User












“The power of a wiki meets the simplicity of a document” - Notion Wiki

Marc Doc:
Markdoc is a lightweight Markdown-based wiki system. It’s been designed to allow you to create and manage wikis as quickly and easily as possible.
What is it good for?
Potential use cases for Markdoc include, but aren’t limited to:
Technical Documentation/Manuals
Markdoc can be used to write and render hand-written guides and manuals for software. Such documentation will normally be separate from automatically-generated API documentation, and might give a higher-level view than API docs alone. It might be used for client documentation for web/desktop applications, or even developer documentation for frameworks.
Internal Project Wikis
Markdoc wikis consist of a single plain-text file per page. By combining a wiki with a DVCS (such asMercurial or Git), you can collaborate with several other people. Use the DVCS to track, share and merge changes with one another, and view the wiki’s history.
Static Site Generation
Markdoc converts wikis into raw HTML files and media. This allows you to manage a blog, personal website or a collection of pages in a Markdoc wiki, perhaps with custom CSS styles, and publish the rendered HTML to a website. Markdoc need not be installed on the hosting site, since the resultant HTML is completely independent.


Dependencies

SendGrid.

marked
