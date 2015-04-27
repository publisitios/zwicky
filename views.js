var fs = require('fs');

module.exports = {
  header: function() {
    var template = fs.readFileSync('./views/header.html', 'utf-8'); // load HTML template
    return template;
  },

  footer: function() {
    var template = fs.readFileSync('./views/footer.html', 'utf-8'); // load HTML template
    return template;
  },

  index: function() {
    var template = fs.readFileSync('./views/index.html', 'utf-8'); // load HTML template
    return template;
  },
  about: function() {
    var template = fs.readFileSync('./views/about.html', 'utf-8'); // load HTML template
    return template;
  },
  markdown: function() {
    var template = fs.readFileSync('./views/markdown.html', 'utf-8'); // load HTML template
    return template;
  },
  view_editors: function() {
    var template = fs.readFileSync('./views/view-editors.html', 'utf-8'); // load HTML template
    return template;
  },
  edit_editor: function() {
    var template = fs.readFileSync('./views/edit-editors.html', 'utf-8'); // load HTML template
    return template;
  },
  view_categories: function() {
    var template = fs.readFileSync('./views/categories.html', 'utf-8'); // load HTML template
    return template;
  },
  edit_category: function() {
    var template = fs.readFileSync('./views/edit-category.html', 'utf-8'); // load HTML template
    return template;
  },  
  create_article: function() {
    var template = fs.readFileSync('./views/create-article.html', 'utf-8'); // load HTML template
    return template;
  },
  view_articles: function() {
    var template = fs.readFileSync('./views/view-articles.html', 'utf-8'); // load HTML template
    return template;
  },
  view_article: function() {
    var template = fs.readFileSync('./views/view-article.html', 'utf-8'); // load HTML template
    return template;
  },
    edit_article: function() {
    var template = fs.readFileSync('./views/edit-article.html', 'utf-8'); // load HTML template
    return template;
  }

};