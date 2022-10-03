const { response } = require('express')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('libee-database.db')

db.run(`
	CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY,
		name TEXT,
		date INTEGER,
    content TEXT,
    link TEXT
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
  const link = request.body.link

  const query = `INSERT INTO projects (name, date, content, link) VALUES (?, ?, ?, ?)`;

  const values = [name, date, content, link];

  db.run(query, values, function (error){

    response.redirect("/projects")


  })

})


  //GET /projects/id
  app.get("/projects/:id", function(request, response){

    const id = request.params.id
	
    const query = `SELECT * FROM projects WHERE id = ?`
    const values = [id]
    
    db.get(query, values, function(error, project){
      
      const model = {
        project,
      }
      
      response.render('project.hbs', model)
      
    })

  })


  app.get("/projects-delete/:id", function(request, response){
    const id = request.params.id

    const query = `DELETE FROM projects where id = ?`
    const values = [id]

    db.run(query, values)

    response.redirect('/projects')
  })

/*
  app.get("/projects-edit/:id", function(request, response){
    const id = request.params.id

    const query = `EDIT FROM projects where id = ?`
    const values = [id]

    db.run(query, values)

    response.redirect('/projects')
  })
*/
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
  /*
app.get("/login", function(request, response){
	response.render("login.hbs")
})

app.post("/login", function(request, response){
	
	const username = request.body.username
	const password = request.body.password
	
	if(username == ADMIN_USERNAME && password == ADMIN_PASSWORD){
		
		request.session.isLoggedIn = true
		
	  response.redirect("/")
		
	}else{
		
		const model = {
			failedToLogin: true
		}
		
		response.render('login.hbs', model)
		
	}
	
})
*/