const express = require('express')
const expressHandlebars = require('express-handlebars')
const data = require('./data.js') 
//const sqlite3 = require('sqlite3')

const PROJECT_TITLE_MAX_LENGTH = 100
const ADMIN_USERNAME = "Linn"
const ADMIN_PASSWORD = "abc123"

//const db = new sqlite3.Database('database.db')

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

app.engine('hbs', expressHandlebars.engine({
	defaultLayout: 'main.hbs',
}))

app.use(
    express.static('public')
)

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(
	expressSession({
		saveUninitialized: false,
		resave: false,
		secret: "fdgfdskdjslakfj"
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
		
		const errorMessages = []
		
		if(error){
			errorMessages.push("Internal server error")
		}
		
		const model = {
			errorMessages,
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
  const date = parseInt(request.body.date, 10)
  const content = request.body.content

  const errorMessages = []

  if(name == ""){
		errorMessages.push("Name can't be empty")
	}else if(PROJECT_NAME_MAX_LENGTH < name.length){
		errorMessages.push("Name may be at most "+PROJECT_NAME_MAX_LENGTH+" characters long")
	}
	
	if(isNaN(date)){
		errorMessages.push("You did not enter a number for the date")
	}else if(date < 0){
		errorMessages.push("Date may not be negative")
	}else if(31 < date){
		errorMessages.push("Date may at most be 31")
	}
	
	if(!request.session.isLoggedIn){
		errorMessages.push("Not logged in")
	}
	
	if(errorMessages.length == 0){
		
		const query = `
			INSERT INTO projects (name, date) VALUES (?, ?)
		`
		const values = [name, date]
		
		db.run(query, values, function(error){
			
			if(error){
				
				errorMessages.push("Internal server error")
				
				const model = {
					errorMessages,
					name,
          date,
          content
				}
				
				response.render('create-project.hbs', model)
				
			}else{
				
				response.redirect("/projects")
				
			}
			
		})
		
	}else{
		
		const model = {
			errorMessages,
			name,
      date,
      content
		}
		
		response.render('create-project.hbs', model)
		
	}
	
})


  //GET /projects/id
  app.get("/projects/:id", function(request, response){

    const id = request.params.id

    const project = data.projects.find(p => p.id == id)

    db.get(query, values, function(error, project){
		
      const model = {
        project,
      }
      
      response.render('project.hbs', model)
      
    })

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

app.listen(8080)