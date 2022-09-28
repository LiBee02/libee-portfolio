const express = require('express')
const expressHandlebars = require('express-handlebars')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('libee-database.db')

db.run(`
	CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY,
		name TEXT,
		date INTEGER,
    content TEXT
	)
`)

const app = express()

app.engine("hbs", expressHandlebars.engine({
  defaultLayout: 'main.hbs'
}))

app.use(
    express.static('public')
)

app.use(
  express.urlencoded({
    extended: false
  })
)


app.get('/', function(request, response){
  
  const model = {
		session: request.session
	}

  response.render('home.hbs')
})


app.get('/projects', function(request, response){

  const query = `SELECT * FROM projects`

  db.all(query, function(error, projects){

    const model = {
      projects
    }
  
      response.render('projects.hbs', model)
  
  })
  
})


app.get('/create-project', function(request, response){
  response.render('create-project.hbs')
})

app.post("/create-project",function(request, response) {

  const name = request.body.name
  const date = request.body.date
  const content = request.body.content

  data.projects.push({
    id: data.projects.at(-1).id + 1,
    name: name,
    date: date,
    content: content
  })

  response.redirect("/projects")
	
})


  //GET /projects/id
  app.get("/projects/:id", function(request, response){

    const id = request.params.id

    const project = data.projects.find(p => p.id == id)

    const model = {
      project: project,
    }

    response.render('movie.hbs', model)

  })

  app.listen(8080)



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
  
//app.get("/login", function(request, response){
	//response.render("login.hbs")
//})

//app.post("/login", function(request, response){
	
	//const username = request.body.username
	//const password = request.body.password
	
	//if(username == ADMIN_USERNAME && password == ADMIN_PASSWORD){
		
	//	request.session.isLoggedIn = true
		
		//response.redirect("/")
		
	//}else{
		
		//const model = {
	//		failedToLogin: true
//		}
		
	//	response.render('login.hbs', model)
		
	//}
	
//})
