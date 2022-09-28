const express = require('express')
const expressHandlebars = require('express-handlebars')
const data = require('./data.js') 
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('Users/linns/database.db')

const app = express()

app.engine("hbs", expressHandlebars.engine({
  defaultLayout: 'main.hbs'
}))

app.use(
    express.static('public')
)

app.get('/', function(request, response){
  response.render('home.hbs')
})

app.get('/projects', function(request, response){

    const model = {
      projects: data.projects
    }

    response.render('projects.hbs', model)

  })


  //GET /projects/id
  app.get("/projects/:id", function(request, response){

    const id = request.params.id

    const project = data.projects.find(p => p.id == id)

    const model = {
      project: project,
    }

    response.render('project.hbs', model)

  })











  app.get('/about', function(request, response){
    response.render('about.hbs')
  })

  app.get('/blog', function(request, response){
    response.render('blog.hbs')
  })

  app.get('/contact', function(request, response){
    response.render('contact.hbs')
  })

  app.get('/faq', function(request, response){
    response.render('faq.hbs')
  })









  //*HAVENT IMPLEMENTED THIS YET*/
  app.get('/secret-page', function(){
    
    if(isLoggedIn = true){
      // Send back secret page

    }else{
      //Send back error

    }
  })

  let isLoggedIn = false


  app.post("/login", function(request, response){

    const username = request.body.username
    const password = request.body.password

    if(username == ADMIN_USERNAME && password == ADMIN_PASSWORD){

    }else{

      const model = {
        failedToLogin: true
      }
    }

  })

app.listen(8080)